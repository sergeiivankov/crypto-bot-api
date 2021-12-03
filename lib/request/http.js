"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
/**
 * Make HTTP GET request
 *
 * Module imported for Node.js library building
 *
 * @param url - Url
 * @param apiKey - Crypto Bot API key
 *
 * @throws Error - If request fail
 *
 * @returns Raw response text
 */
const request = (url, apiKey) => new Promise((resolve, reject) => {
    const options = {
        headers: { 'Crypto-Pay-API-Token': apiKey },
    };
    const req = (0, https_1.request)(url, options, (res) => {
        let data = '';
        res.on('error', reject);
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            resolve(data);
        });
    });
    req.on('error', reject);
    req.end();
});
exports.default = request;
