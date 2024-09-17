"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRequestBody = exports.checkSignature = void 0;
const crypto_1 = require("crypto");
const http_1 = require("http");
const https_1 = require("https");
const Client_1 = require("./Client");
const casts_1 = require("../helpers/casts");
/**
 * Check webhook data signature
 *
 * @param apiKey - Api key
 * @param signature - Webhook request signature
 * @param body - Webhook request body
 *
 * @returns Checking result
 */
const checkSignature = (apiKey, signature, body) => {
    try {
        const secret = (0, crypto_1.createHash)('sha256').update(apiKey).digest();
        const checkString = JSON.stringify(body);
        const hmac = (0, crypto_1.createHmac)('sha256', secret).update(checkString).digest('hex');
        return hmac === signature;
    }
    catch {
        return false;
    }
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
        catch {
            resolve(null);
            return;
        }
        resolve(data);
    });
});
exports.readRequestBody = readRequestBody;
// Because `tsdoc` not support `@category` tag, but `typedoc` support
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
    // Because `tsdoc` throw `tsdoc-reference-selector-missing-parens`,
    // but `typedoc` doesn't recognize reference in parentheses
    /* eslint-disable tsdoc/syntax */
    /** {@inheritDoc Client:constructor} */
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
     * If you app work behind proxy and no need create HTTPS server,
     * no pass `key` and `cert` fields and add `http` field with `true` value: `{ http: true }`
     *
     * Note: if you want to use self-signed certificate
     * you must uploat it in CryptoBot API application settings
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
                (0, exports.readRequestBody)(req).then((data) => this._handleWebhook(data, req, res));
            };
            let server;
            try {
                server = serverOptions.http === true
                    ? (0, http_1.createServer)(serverOptions, requestListener)
                    : (0, https_1.createServer)(serverOptions, requestListener);
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
                .then((data) => this._handleWebhook(data, req, res));
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
     * @param req - Node.js built-in IncomingMessage object
     * @param res - Node.js built-in ServerResponse object
     */
    _handleWebhook(data, req, res) {
        if (!data) {
            res.statusCode = 401;
            res.end();
            return;
        }
        const header = req.headers['crypto-pay-api-signature'];
        const signature = Array.isArray(header) ? header[0] : header;
        if (!(0, exports.checkSignature)(this._apiKey, signature, data)) {
            res.statusCode = 401;
            res.end();
            return;
        }
        if (data.update_type === 'invoice_paid') {
            this._emit('paid', (0, casts_1.toInvoice)(data.payload), new Date(data.request_date));
        }
        res.end();
    }
}
exports.default = ClientEmitter;
