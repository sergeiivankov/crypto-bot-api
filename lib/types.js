"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestXhr = exports.requestHttp = exports.Transport = exports.createFetchHandler = exports.Store = exports.readRequestBody = exports.checkSignature = exports.ClientEmitter = exports.Client = exports.Server = void 0;
var https_1 = require("https");
Object.defineProperty(exports, "Server", { enumerable: true, get: function () { return https_1.Server; } });
var Client_1 = require("./classes/Client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return Client_1.default; } });
var ClientEmitter_1 = require("./classes/ClientEmitter");
Object.defineProperty(exports, "ClientEmitter", { enumerable: true, get: function () { return ClientEmitter_1.default; } });
Object.defineProperty(exports, "checkSignature", { enumerable: true, get: function () { return ClientEmitter_1.checkSignature; } });
Object.defineProperty(exports, "readRequestBody", { enumerable: true, get: function () { return ClientEmitter_1.readRequestBody; } });
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
const ClientEmitter_2 = require("./classes/ClientEmitter");
exports.default = ClientEmitter_2.default;
