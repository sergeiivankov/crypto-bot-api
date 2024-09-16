"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFetchHandler = void 0;
const casts_1 = require("../helpers/casts");
const Transport_1 = require("./Transport");
/**
 * Create cached fetch handler for passed data type
 *
 * Store using for data types, which change infrequently.
 * For example, app infomation from `getMe` method.
 * For method calls more often than the passed update period,
 * returned data from cache without real request to backend API
 *
 * @remarks
 * Returned update data function receive `isForce` boolean parameter,
 * if it `true`, for this method call function makes real request to backend API
 *
 * @typeParam T - One of library methods return data type
 *
 * @param transport - Transport class instance
 * @param method - Backend API method, data type related
 * @param castFn - Convert backend API result to inner library method result type function
 * @param updatePeriod - Updatin data from backend API period
 *
 * @returns Update data type function
 */
const createFetchHandler = (transport, method, castFn, updatePeriod) => {
    let promise = null;
    let prevUpdateStamp = 0;
    let data;
    return (isForce = false) => {
        // If data fetching in process, return same promise
        // Need to prevent same multiple requests in one time
        // if Client class methods call parallel
        // This situation may arise due to the fact that some
        // methods need multiple backend API response to
        // return prepared result. For example, Client.getBalances
        // method need currencies information from getCurrencies
        // backend API method for correct formatting of amounts
        if (promise)
            return promise;
        // Calculate current update perion number
        const updateStamp = Math.floor(+(new Date()) / 1000 / updatePeriod);
        if (updateStamp === prevUpdateStamp && !isForce) {
            return Promise.resolve(data);
        }
        prevUpdateStamp = updateStamp;
        promise = transport.call(method).then((value) => {
            data = castFn(value);
            promise = null;
            return data;
        });
        return promise;
    };
};
exports.createFetchHandler = createFetchHandler;
// Because `tsdoc` not support `@category` tag, but `typedoc` support
/* eslint-disable tsdoc/syntax */
/**
 * Wrapper for API methods that return possible cached data
 *
 * @category External
 */
/* eslint-enable tsdoc/syntax */
class Store {
    /**
     * Create class instance
     *
     * @param apiKey - Crypto Bot API key, looks like '1234:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
     * @param endpoint - API endpoint url or 'mainnet' or 'testnet'
     *                   for hardcoded in library endpoint urls
     *
     * @throws Error - If passed invalid API key or endpoint
     */
    constructor(apiKey, endpoint = 'mainnet') {
        this._transport = new Transport_1.default(apiKey, endpoint);
    }
    /**
     * Get API supported currencies infomation
     *
     * Use {@link toCurrencies} backend API result convert function
     *
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API supported currencies infomation object
     */
    getCurrencies(isForce) {
        if (!this._currenciesFetchHandler) {
            this._currenciesFetchHandler = (0, exports.createFetchHandler)(this._transport, 'getCurrencies', casts_1.toCurrencies, Store._CURRENCIES_UPDATE_PERIOD);
        }
        return this._currenciesFetchHandler(isForce);
    }
    /**
     * Get API supported currencies exchange rate infomation
     *
     * Use {@link toExchangeRates} backend API result convert function
     *
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API supported currencies exchange rate infomation object
     */
    getExchangeRates(isForce) {
        if (!this._exchangeRatesFetchHandler) {
            this._exchangeRatesFetchHandler = (0, exports.createFetchHandler)(this._transport, 'getExchangeRates', casts_1.toExchangeRates, Store._EXCHANGE_RATES_UPDATE_PERIOD);
        }
        return this._exchangeRatesFetchHandler(isForce);
    }
    /**
     * Get associated with passed API key app infomation
     *
     * Use {@link toMe} backend API result convert function
     *
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to associated with passed API key app infomation object
     */
    getMe(isForce = false) {
        if (!this._meFetchHandler) {
            this._meFetchHandler = (0, exports.createFetchHandler)(this._transport, 'getMe', casts_1.toMe, Store._ME_UPDATE_PERIOD);
        }
        return this._meFetchHandler(isForce);
    }
}
/** Update period for fetching currencies from backend API in seconds */
Store._CURRENCIES_UPDATE_PERIOD = 3600;
/** Update period for fetching exhange rates from backend API in seconds */
Store._EXCHANGE_RATES_UPDATE_PERIOD = 60;
/** Update period for fetching app infomation from backend API in seconds */
Store._ME_UPDATE_PERIOD = 3600;
exports.default = Store;
