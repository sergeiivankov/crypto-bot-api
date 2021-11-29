"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
/**
 * Make HTTP GET request
 *
 * Module imported for Node.js library building
 *
 * @param url - Url
 *
 * @throws Error - If request fail
 *
 * @returns Raw response text
 */
const request = (url) => new Promise((resolve, reject) => {
    const req = (0, https_1.request)(url, {}, (res) => {
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
