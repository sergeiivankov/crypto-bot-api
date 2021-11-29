"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareGetInvoicesPaginateOptions = exports.prepareGetInvoicesOptions = exports.prepareCreateInvoiceOptions = exports.nonosToCoins = exports.isValidUrl = exports.getExchageRate = void 0;
/**
 * Return exchange rate to passed currencies pair
 *
 * @param source - Source currency code
 * @param target - Target currency code
 * @param exchangeRates - Exchange rates information from {@link Store.getExchangeRates} method
 * @param currencies - Currencies information from {@link Store.getCurrencies} method
 *
 * @returns Exchange rate or zero, if currencies pair not exists
 */
const getExchageRate = (source, target, exchangeRates, currencies) => {
    var _a;
    let rate = NaN;
    for (let i = 0, l = exchangeRates.length; i < l; i += 1) {
        const exchangeRate = exchangeRates[i];
        // If source and target correspond to direction in Store.getExchangeRates method result
        if (exchangeRate.source === source && exchangeRate.target === target) {
            rate = exchangeRate.rate;
            break;
        }
        // If source and target reverse to direction in Store.getExchangeRates method result
        if (exchangeRate.source === target && exchangeRate.target === source) {
            rate = 1 / exchangeRate.rate;
            break;
        }
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(rate))
        return 0;
    const numberOfNanosSigns = ((_a = currencies[target]) === null || _a === void 0 ? void 0 : _a.decimals) || 8;
    return parseFloat(rate.toFixed(numberOfNanosSigns));
};
exports.getExchageRate = getExchageRate;
/**
 * Url check reguar expression
 */
const URL_CHECK_REGEXP = /^https?:\/\/((([a-z\d][a-z\d-]*[a-z\d])\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*$/i;
/**
 * Check is string is valid url
 *
 * @param input - String
 *
 * @returns Check result
 */
const isValidUrl = (input) => URL_CHECK_REGEXP.test(input);
exports.isValidUrl = isValidUrl;
/**
 * Convert nanos string value to the form of string of whole coins
 *
 * @remarks
 * Currencies need to know how many characters after decimal point are used by currency
 *
 * @param value - Value in nanos
 * @param currencyCode - Currency code
 * @param currencies - Currencies information from {@link Store.getCurrencies} method
 *
 * @returns Representation of amount in coins
 */
const nonosToCoins = (value, currencyCode, currencies) => {
    var _a;
    let result = value;
    // Use default value as `8` if decimals property is lost
    const numberOfNanosSigns = ((_a = currencies[currencyCode]) === null || _a === void 0 ? void 0 : _a.decimals) || 8;
    const zerosNeed = numberOfNanosSigns - result.length;
    if (zerosNeed > 0) {
        let zeros = '';
        for (let i = 0; i < zerosNeed; i += 1)
            zeros += '0';
        result = zeros + result;
    }
    if (result.length === numberOfNanosSigns)
        result = `0.${result}`;
    else {
        const pointPosition = result.length - numberOfNanosSigns;
        result = `${result.substr(0, pointPosition)}.${result.substr(pointPosition)}`;
    }
    // Remove trailing zeros
    return result.replace(/0+$/, '');
};
exports.nonosToCoins = nonosToCoins;
/**
 * Convert {@link CreateInvoiceOptions} object to using backend API method
 * parameters {@link CreateInvoiceBackendOptions} object
 *
 * @param options - Library {@link Client.createInvoice} method options object
 *
 * @throws Error - If options object invalid
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareCreateInvoiceOptions = (options) => {
    // Check is options object valid
    if (options.description && options.description.length > 1024) {
        throw new Error('Description can\'t be longer than 1024 characters');
    }
    if (options.payload && options.payload.length > 1024) {
        throw new Error('Payload can\'t be longer than 1024 characters');
    }
    if (options.paidBtnName && !options.paidBtnUrl) {
        throw new Error('Require paidBtnUrl parameter if paidBtnName parameter pass');
    }
    // Create object with required parameters
    const prepared = {
        asset: options.currency,
        amount: +options.amount,
    };
    // Same names
    if (options.description !== undefined)
        prepared.description = options.description;
    if (options.payload !== undefined)
        prepared.payload = options.payload;
    // Different names
    if (options.paidBtnUrl !== undefined)
        prepared.paid_btn_url = options.paidBtnUrl;
    if (options.paidBtnName !== undefined)
        prepared.paid_btn_name = options.paidBtnName;
    if (options.isAllowComments !== undefined)
        prepared.allow_comments = options.isAllowComments;
    if (options.isAllowAnonymous !== undefined)
        prepared.allow_anonymous = options.isAllowAnonymous;
    return prepared;
};
exports.prepareCreateInvoiceOptions = prepareCreateInvoiceOptions;
/**
 * Convert {@link GetInvoicesOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoices} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareGetInvoicesOptions = (options) => {
    // Create empty object, method doesn't have required parameters
    const prepared = {};
    // Same names
    if (options.status !== undefined)
        prepared.status = options.status;
    if (options.offset !== undefined)
        prepared.offset = options.offset;
    if (options.count !== undefined)
        prepared.count = options.count;
    // Different names
    if (options.currency !== undefined)
        prepared.asset = options.currency;
    if (options.ids !== undefined) {
        prepared.invoices_ids = options.ids.map((value) => +value);
    }
    return prepared;
};
exports.prepareGetInvoicesOptions = prepareGetInvoicesOptions;
/**
 * Convert {@link GetInvoicesPaginateOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoices} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareGetInvoicesPaginateOptions = (pageSize, options) => {
    // Create empty object, method doesn't have required parameters
    const prepared = {};
    // Same names
    if (options.status !== undefined)
        prepared.status = options.status;
    // Different names
    if (options.currency !== undefined)
        prepared.asset = options.currency;
    if (options.ids !== undefined) {
        prepared.invoices_ids = options.ids.map((value) => +value);
    }
    // Paginate options
    let page = options.page ? +options.page : 1;
    if (page < 1)
        page = 1;
    prepared.count = pageSize;
    prepared.offset = pageSize * (page - 1);
    return prepared;
};
exports.prepareGetInvoicesPaginateOptions = prepareGetInvoicesPaginateOptions;
