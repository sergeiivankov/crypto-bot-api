"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const casts_1 = require("../helpers/casts");
const utils_1 = require("../helpers/utils");
const Store_1 = require("./Store");
/* eslint-disable tsdoc/syntax */
/**
 * Main class for work with API for browsers
 *
 * Library for browsers default export this class
 *
 * @category External
 */
/* eslint-enable tsdoc/syntax */
class Client extends Store_1.default {
    constructor() {
        super(...arguments);
        /** Page size for {@link Client.getInvoicesPaginate} method */
        this._pageSize = 100;
    }
    /**
     * Return count invoices per page for {@link Client.getInvoicesPaginate} method
     */
    getPageSize() {
        return this._pageSize;
    }
    /**
     * Set count invoices per page for {@link Client.getInvoicesPaginate} method
     *
     * @param pageSize - Invoices per page
     *
     * @throws Error - If `pageSize` parameter is invalid
     */
    setPageSize(pageSizeParam) {
        const pageSize = +pageSizeParam;
        if (pageSize > 1000 || pageSize < 1) {
            throw Error('Page size may be from 1 to 1000');
        }
        this._pageSize = pageSize;
    }
    /**
     * Get API app balances infomation
     *
     * Use {@link toBalances} backend API result convert function
     *
     * Call {@link Store.getCurrencies} method to fetch exchange rates information
     *
     * @param isReturnInNanos - If true, return raw balances in nanos,
     *                          else return converted to coins balances
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balances infomation object
     */
    getBalances(isReturnInNanos = false, isForce = false) {
        return Promise.all([this.getCurrencies(isForce), this._transport.call('getBalance')])
            // eslint-disable-next-line arrow-body-style
            .then(([currencies, balancesResponse]) => {
            return (0, casts_1.toBalances)(balancesResponse, currencies, isReturnInNanos);
        });
    }
    /**
     * Get API app balance value for passed currency
     *
     * Call {@link Client.getBalances} method to fetch balances information
     *
     * @param currencyCode - Currency code
     * @param isReturnInNanos - If true, return raw balances in nanos,
     *                          else return converted to coins balances
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balance value for passed currency
     */
    getBalance(currencyCode, isReturnInNanos = false, isForce = false) {
        return this.getBalances(isReturnInNanos, isForce)
            .then((balances) => {
            if (balances[currencyCode] === undefined)
                return '0';
            return balances[currencyCode];
        });
    }
    /**
     * Get currency with passed code infomation
     *
     * Call {@link Store.getCurrencies} method to fetch currencies information
     *
     * @param currencyCode - Currency code
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to currency with passed code infomation object
     *          or null, if currency with passed code not exists
     */
    getCurrency(currencyCode, isForce = false) {
        return this.getCurrencies(isForce)
            .then((currencies) => {
            if (currencies[currencyCode] === undefined)
                return null;
            return currencies[currencyCode];
        });
    }
    /**
     * Get one exchange rate infomation to passed currencies pair
     *
     * Call {@link Store.getExchangeRates} method to fetch exchange rates information,
     * {@link Store.getCurrencies} method to fetch currencies information
     * and use {@link getExchageRate} function to get signle exchange rate
     *
     * @param source - Source currency code
     * @param target - Target currency code
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to exchange rate or zero, if currencies pair not exists
     */
    getExchangeRate(source, target, isForce = false) {
        return Promise.all([this.getCurrencies(isForce), this.getExchangeRates(isForce)])
            // eslint-disable-next-line arrow-body-style
            .then(([currencies, exchangeRates]) => {
            return (0, utils_1.getExchageRate)(source, target, exchangeRates, currencies);
        });
    }
    /**
     * Create invoice
     *
     * Use {@link toInvoice} backend API result convert function and
     * prepare backend API parameters {@link prepareCreateInvoiceOptions} function
     *
     * @param options - New invoice options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to created invoice information object
     */
    createInvoice(options) {
        return this._transport.call('createInvoice', (0, utils_1.prepareCreateInvoiceOptions)(options))
            .then((result) => (0, casts_1.toInvoice)(result));
    }
    /**
     * Get invoices
     *
     * Use {@link toInvoices} backend API result convert function and
     * prepare backend API parameters {@link prepareGetInvoicesOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to invoices information object
     */
    getInvoices(options = {}) {
        return this._transport.call('getInvoices', (0, utils_1.prepareGetInvoicesOptions)(options))
            .then((result) => (0, casts_1.toInvoices)(result));
    }
    /**
     * Get invoices paginated
     *
     * Fetch invoices with `page` options parameter, except `count` and `offset`
     *
     * See {@link Client.getPageSize} and {@link Client.setPageSize}
     *
     * Use {@link toInvoicesPaginated} backend API result convert function and
     * prepare backend API parameters {@link prepareGetInvoicesPaginateOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to invoices information object
     */
    getInvoicesPaginate(options = {}) {
        const prepared = (0, utils_1.prepareGetInvoicesPaginateOptions)(this._pageSize, options);
        return this._transport.call('getInvoices', prepared)
            // eslint-disable-next-line arrow-body-style
            .then((result) => {
            return (0, casts_1.toInvoicesPaginated)(options.page, this._pageSize, result);
        });
    }
    /**
     * Call backend API method directly (types unsafe)
     *
     * Use it if backend API update (add new methods, change request or response fileds),
     * but library is not
     *
     * @param method - Backend API method name
     * @param options - Backend API options object
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to backend API response `result` field value
     */
    call(method, options = {}) {
        return this._transport.call(method, options);
    }
}
exports.default = Client;
