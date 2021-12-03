"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRequestBody = exports.checkSignature = void 0;
const crypto_1 = require("crypto");
const https_1 = require("https");
const Client_1 = require("./Client");
const casts_1 = require("../helpers/casts");
/* eslint-disable tsdoc/syntax */
/**
 * Check webhook data signature
 *
 * @param apiKey - Api key
 * @param args - Request body `invoice_paid` field
 * @param args.signature - Request body `invoice_paid` field `signature` field
 * @param args.data - Request body `invoice_paid` field other fields
 *
 * @returns Checking result
 */
/* eslint-enable tsdoc/syntax */
const checkSignature = (apiKey, { signature, ...data }) => {
    const secret = (0, crypto_1.createHash)('sha256').update(apiKey).digest();
    const checkString = Object.keys(data).sort().map((k) => `${k}=${data[k]}`).join('\n');
    return signature === (0, crypto_1.createHmac)('sha256', secret).update(checkString).digest('hex');
};
exports.checkSignature = checkSignature;
/**
 * Read and parsing to JSON request body
 *
 * @param req - Node.js built-in IncomingMessage object
 *
 * @returns Promise, what resolved to parsed body or `null` for parsing error
 */
const readRequestBody = (req) => new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        let data;
        try {
            data = JSON.parse(body);
        }
        catch (err) {
            resolve(null);
            return;
        }
        resolve(data);
    });
});
exports.readRequestBody = readRequestBody;
/* eslint-disable tsdoc/syntax */
/**
 * Main class for work with API for Node.js
 *
 * Library for Node.js default export this class
 *
 * @category External
 */
/* eslint-enable tsdoc/syntax */
class ClientEmitter extends Client_1.default {
    /* eslint-disable tsdoc/syntax */
    /** @inheritdoc */
    /* eslint-enable tsdoc/syntax */
    constructor(apiKey, endpoint = 'mainnet') {
        super(apiKey, endpoint);
        /** Event listeners store */
        this._events = {};
        this._apiKey = apiKey;
    }
    /**
     * Create handling webhooks server
     *
     * Important: at the time of publication of version 0.1.0 (Dec 4, 2021),
     * test API servers do not accept self-signed certificates
     *
     * @param serverOptions - Node.js built-in server options
     * @param secretPath - Webhooks secret path, processing webhooks takes place only on it
     * @param listenOptions - Node.js built-in server listen options
     *
     * @throws Error - If create server error
     *
     * @returns Promise, what resolved `void`
     */
    createServer(serverOptions, secretPath = '/', listenOptions = { port: 443 }) {
        return new Promise((resolve, reject) => {
            const requestListener = (req, res) => {
                if (req.url !== secretPath) {
                    res.statusCode = 404;
                    res.end();
                    return;
                }
                (0, exports.readRequestBody)(req).then((data) => this._handleWebhook(data, res));
            };
            let server;
            try {
                server = (0, https_1.createServer)(serverOptions, requestListener);
            }
            catch (err) {
                reject(err);
                return;
            }
            server.on('error', reject);
            try {
                server.listen(listenOptions, () => {
                    this._server = server;
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /**
     * Close created handling webhooks server
     *
     * @throws Error - If server not was started or closing error
     *
     * @returns Promise, what resolved `void`
     */
    closeServer() {
        if (!this._server)
            return Promise.reject(new Error('Server not started'));
        return new Promise((resolve, reject) => {
            this._server.close((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    /**
     * Create middleware function for Express.js-like API
     *
     * @returns Middleware function
     */
    middleware() {
        return (req, res) => {
            Promise.resolve()
                .then(() => req.body || (0, exports.readRequestBody)(req))
                .then((data) => this._handleWebhook(data, res));
        };
    }
    /**
     * Subscribes to event
     *
     * @param event - Event name
     * @param listener - Event listener
     */
    on(event, listener) {
        if (!this._events[event])
            this._events[event] = [];
        this._events[event].push(listener);
    }
    /**
     * Unsubscribes from event
     *
     * @param event - Event name
     * @param listener - Event listener
     */
    off(event, listener) {
        if (!this._events[event])
            return;
        const idx = this._events[event].indexOf(listener);
        if (idx > -1)
            this._events[event].splice(idx, 1);
    }
    /**
     * Emit event to listeners
     *
     * @param event - Event name
     * @param params - Call event listeners parameters
     */
    _emit(event, ...params) {
        if (!this._events[event])
            return;
        this._events[event].forEach((listener) => {
            listener(...params);
        });
    }
    /**
     * Handling webhook data, send response and emit events
     *
     * @param data - Parsed request body
     * @param res - Node.js built-in ServerResponse object
     */
    _handleWebhook(data, res) {
        if (!data) {
            res.statusCode = 500;
            res.end();
            return;
        }
        if (!(0, exports.checkSignature)(this._apiKey, data.invoice_paid)) {
            res.statusCode = 401;
            res.end();
            return;
        }
        this._emit('paid', (0, casts_1.toInvoice)(data.invoice_paid), new Date(data.invoice_paid.request_date * 1000));
        res.end();
    }
}
exports.default = ClientEmitter;
