"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../helpers/utils");
const http_1 = require("../request/http");
/**
 * Make backend API calls
 */
class Transport {
    /**
     * Create class instance
     *
     * @param apiKey - Crypto Bot API key, looks like '1234:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
     * @param endpoint - API endpoint url or 'mainnet' or 'testnet'
     *                   for hardcoded in library endpoint urls
     *
     * @throws Error - If passed invalid API key or endpoint
     */
    constructor(apiKey, endpoint) {
        if (!Transport.KEY_CHECK_REGEXP.test(apiKey)) {
            throw new Error('API key looks like invalid');
        }
        let url;
        if (endpoint === 'mainnet') {
            url = 'https://pay.crypt.bot/api';
        }
        else if (endpoint === 'testnet') {
            url = 'https://testnet-pay.crypt.bot/api';
        }
        else if (!(0, utils_1.isValidUrl)(endpoint)) {
            throw new Error('Endpoint parameter not contain valid URL');
        }
        else {
            url = endpoint;
        }
        this._apiKey = apiKey;
        this._baseUrl = `${url}/`;
    }
    /**
     * Make request to backend API, handle errors and return result
     *
     * @param method - Backend API method name
     * @param parameters - Method parameters object
     *
     * @throws Error - If response have errors
     *
     * @returns Promise, what resolved to API response `result` field
     */
    call(method, parameters) {
        // Format url query part from passed parameters object
        let qs = '';
        if (parameters) {
            Object.keys(parameters).forEach((name) => {
                let value = parameters[name];
                if (Array.isArray(value))
                    value = value.join(',');
                else
                    value = value.toString();
                qs += `&${name}=${encodeURIComponent(value)}`;
            });
        }
        return (0, http_1.default)(this._baseUrl + method + (qs.length ? `?${qs.substr(1)}` : ''), this._apiKey)
            .then((rawResponse) => {
            let response;
            try {
                response = JSON.parse(rawResponse);
            }
            catch {
                throw new Error(`Response parse error, raw reponse:\n${rawResponse}`);
            }
            if (response.ok !== true) {
                if (!response.error)
                    throw new Error('Api response unknown error');
                throw new Error(`Api response error ${JSON.stringify(response.error)}`);
            }
            return response.result;
        });
    }
}
/** RegExp to check API key */
Transport.KEY_CHECK_REGEXP = /\d{1,}:[a-zA-Z0-9]{35}/;
exports.default = Transport;
