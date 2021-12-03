"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Make HTTP GET request
 *
 * Module imported only for browsers bundle
 *
 * @param url - Url
 * @param apiKey - Crypto Bot API key
 *
 * @throws Error - If request fail
 *
 * @returns Raw response text
 */
const request = (url, apiKey) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Crypto-Pay-API-Token', apiKey);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4)
            return;
        resolve(xhr.responseText);
    };
    xhr.onerror = () => {
        reject(new Error('Network Error'));
    };
    xhr.send();
});
exports.default = request;
