"use strict";
// File using to generate documentation for all project entities, except only external
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestXhr = exports.requestHttp = exports.Transport = exports.createFetchHandler = exports.Store = exports.Client = void 0;
// eslint-disable-next-line import/prefer-default-export
var Client_1 = require("./classes/Client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return Client_1.default; } });
var Store_1 = require("./classes/Store");
Object.defineProperty(exports, "Store", { enumerable: true, get: function () { return Store_1.default; } });
Object.defineProperty(exports, "createFetchHandler", { enumerable: true, get: function () { return Store_1.createFetchHandler; } });
var Transport_1 = require("./classes/Transport");
Object.defineProperty(exports, "Transport", { enumerable: true, get: function () { return Transport_1.default; } });
__exportStar(require("./helpers/casts"), exports);
__exportStar(require("./helpers/utils"), exports);
var http_1 = require("./request/http");
Object.defineProperty(exports, "requestHttp", { enumerable: true, get: function () { return http_1.default; } });
var xhr_1 = require("./request/xhr");
Object.defineProperty(exports, "requestXhr", { enumerable: true, get: function () { return xhr_1.default; } });
