"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const casts_1 = require("../helpers/casts");
const utils_1 = require("../helpers/utils");
const Store_1 = require("./Store");
// Because `tsdoc` not support `@category` tag, but `typedoc` support
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
     * @param pageSizeParam - Invoices per page
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
     * Get associated with passed API key app statistics
     *
     * Use {@link toStats} backend API result convert function
     *
     * @param options - New receive statistics options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to associated with passed API key app statistics object
     */
    getStats(options = {}) {
        return this._transport.call('getStats', (0, utils_1.prepareGetStatsOptions)(options))
            .then((result) => (0, casts_1.toStats)(result));
    }
    /**
     * Get API app balances infomation
     *
     * Use {@link toBalances} backend API result convert function
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balances infomation object
     */
    getBalances() {
        return this._transport.call('getBalance').then((result) => (0, casts_1.toBalances)(result));
    }
    /**
     * Get API app balances infomation
     *
     * Use {@link toBalances} backend API result convert function
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app available balances infomation object
     */
    getBalancesAvailable() {
        return this.getBalances()
            .then((balances) => {
            return Object.entries(balances).reduce((accumulator, entry) => {
                const [code, balance] = entry;
                accumulator[code] = balance.available;
                return accumulator;
            }, {});
        });
    }
    /**
     * Get API app balances infomation
     *
     * Use {@link toBalances} backend API result convert function
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balances on hold infomation object
     */
    getBalancesOnhold() {
        return this.getBalances()
            .then((balances) => {
            return Object.entries(balances).reduce((accumulator, entry) => {
                const [code, balance] = entry;
                accumulator[code] = balance.onhold;
                return accumulator;
            }, {});
        });
    }
    /**
     * Get API app balance value for passed currency
     *
     * Call {@link Client.getBalances} method to fetch balances information
     *
     * @param currencyCode - Crypto currency code
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balance value for passed currency
     */
    getBalance(currencyCode) {
        return this.getBalances()
            .then((balances) => {
            if (balances[currencyCode] === undefined)
                return { available: '0', onhold: '0' };
            return balances[currencyCode];
        });
    }
    /**
     * Get API app balance value for passed currency
     *
     * Call {@link Client.getBalances} method to fetch balances information
     *
     * @param currencyCode - Crypto currency code
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app available balance value for passed currency
     */
    getBalanceAvailable(currencyCode) {
        return this.getBalances()
            .then((balances) => {
            if (balances[currencyCode] === undefined)
                return '0';
            return balances[currencyCode].available;
        });
    }
    /**
     * Get API app balance value for passed currency
     *
     * Call {@link Client.getBalances} method to fetch balances information
     *
     * @param currencyCode - Crypto currency code
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balance on hold value for passed currency
     */
    getBalanceOnhold(currencyCode) {
        return this.getBalances()
            .then((balances) => {
            if (balances[currencyCode] === undefined)
                return '0';
            return balances[currencyCode].onhold;
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
        return this.getExchangeRates(isForce)
            .then((exchangeRates) => {
            return (0, utils_1.getExchageRate)(source, target, exchangeRates);
        });
    }
    /**
     * Transfer
     *
     * Use {@link toTransfer} backend API result convert function and
     * prepare backend API parameters {@link prepareTransferOptions} function
     *
     * @param options - Transfer options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to completed transfer information object
     */
    transfer(options) {
        return this._transport.call('transfer', (0, utils_1.prepareTransferOptions)(options))
            .then((result) => (0, casts_1.toTransfer)(result));
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
     * Create check
     *
     * Use {@link toCheck} backend API result convert function and
     * prepare backend API parameters {@link prepareCreateCheckOptions} function
     *
     * @param options - New check options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to created check information object
     */
    createCheck(options) {
        return this._transport.call('createCheck', (0, utils_1.prepareCreateCheckOptions)(options))
            .then((result) => (0, casts_1.toCheck)(result));
    }
    /**
     * Delete invoice
     *
     * @param id - Invoice identifier
     *
     * @throws Error - If there is an error sending request to backend API or parsing response error
     *
     * @returns Promise, what resolved to boolean operation result status
     */
    deleteInvoice(id) {
        return this._transport.call('deleteInvoice', { invoice_id: (0, utils_1.prepareDeleteOptions)(id) });
    }
    /**
     * Delete check
     *
     * @param id - Check identifier
     *
     * @throws Error - If there is an error sending request to backend API or parsing response error
     *
     * @returns Promise, what resolved to boolean operation result status
     */
    deleteCheck(id) {
        return this._transport.call('deleteCheck', { check_id: (0, utils_1.prepareDeleteOptions)(id) });
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
     * Use {@link toInvoices} backend API result convert function and
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
            .then((result) => (0, casts_1.toInvoices)(result));
    }
    /**
     * Get checks
     *
     * Use {@link toChecks} backend API result convert function and
     * prepare backend API parameters {@link prepareGetChecksOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to checks information object
     */
    getChecks(options = {}) {
        return this._transport.call('getChecks', (0, utils_1.prepareGetChecksOptions)(options))
            .then((result) => (0, casts_1.toChecks)(result));
    }
    /**
     * Get checks paginated
     *
     * Fetch checks with `page` options parameter, except `count` and `offset`
     *
     * See {@link Client.getPageSize} and {@link Client.setPageSize}
     *
     * Use {@link toChecks} backend API result convert function and
     * prepare backend API parameters {@link prepareGetChecksPaginateOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to checks information object
     */
    getChecksPaginate(options = {}) {
        const prepared = (0, utils_1.prepareGetChecksPaginateOptions)(this._pageSize, options);
        return this._transport.call('getChecks', prepared)
            .then((result) => (0, casts_1.toChecks)(result));
    }
    /**
     * Get transfers
     *
     * Use {@link toTransfers} backend API result convert function and
     * prepare backend API parameters {@link prepareGetTransfersOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to transfers information object
     */
    getTransfers(options = {}) {
        return this._transport.call('getTransfers', (0, utils_1.prepareGetTransfersOptions)(options))
            .then((result) => (0, casts_1.toTransfers)(result));
    }
    /**
     * Get transfers paginated
     *
     * Fetch checks with `page` options parameter, except `count` and `offset`
     *
     * See {@link Client.getPageSize} and {@link Client.setPageSize}
     *
     * Use {@link toTransfers} backend API result convert function and
     * prepare backend API parameters {@link prepareGetTransfersOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to transfers information object
     */
    getTransfersPaginate(options = {}) {
        const prepared = (0, utils_1.prepareGetTransfersPaginateOptions)(this._pageSize, options);
        return this._transport.call('getTransfers', prepared)
            .then((result) => (0, casts_1.toTransfers)(result));
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
/**
 * Access to {@link CurrencyType} enumeration, used in {@link Invoice} type
 */
Client.CurrencyType = casts_1.CurrencyType;
/**
* Access to {@link DetailedCurrencyType} enumeration, used in {@link Store.getCurrencies}
* and {@link Client.getCurrency} methods results
*/
Client.DetailedCurrencyType = casts_1.DetailedCurrencyType;
/**
 * Access to {@link InvoiceStatus} enumeration, used in {@link Invoice} type,
 * {@link Client.getInvoices} and {@link Client.getInvoicesPaginate} methods options
 */
Client.InvoiceStatus = casts_1.InvoiceStatus;
/**
 * Access to {@link CheckStatus} enumeration, used in {@link Check} type,
 * {@link Client.getChecks} and {@link Client.getChecksPaginate} methods options
 */
Client.CheckStatus = casts_1.CheckStatus;
/**
 * Access to {@link TransferStatus} enumeration, used in {@link Transfer} type,
 * {@link Client.getTransfers} and {@link Client.getTransfersPaginate} methods options
 */
Client.TransferStatus = casts_1.TransferStatus;
exports.default = Client;
