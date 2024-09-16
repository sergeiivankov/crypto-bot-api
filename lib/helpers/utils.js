"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareGetTransfersPaginateOptions = exports.prepareGetTransfersOptions = exports.prepareGetChecksPaginateOptions = exports.prepareGetChecksOptions = exports.prepareGetInvoicesPaginateOptions = exports.prepareGetInvoicesOptions = exports.prepareDeleteOptions = exports.prepareCreateInvoiceOptions = exports.prepareCreateCheckOptions = exports.prepareTransferOptions = exports.prepareGetStatsOptions = exports.isValidUrl = exports.getExchageRate = void 0;
const casts_1 = require("./casts");
/**
 * Return exchange rate to passed currencies pair
 *
 * @param source - Source currency code
 * @param target - Target currency code
 * @param exchangeRates - Exchange rates information from {@link Store.getExchangeRates} method
 *
 * @returns Exchange rate or zero, if currencies pair not exists
 */
const getExchageRate = (source, target, exchangeRates) => {
    let rate = '';
    for (let i = 0, l = exchangeRates.length; i < l; i += 1) {
        const exchangeRate = exchangeRates[i];
        // If source and target correspond to direction in Store.getExchangeRates method result
        if (exchangeRate.source === source && exchangeRate.target === target) {
            if (exchangeRate.isValid)
                rate = exchangeRate.rate;
            break;
        }
    }
    if (rate === '')
        return '0';
    return rate;
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
 * Convert {@link GetStatsOptions} object to using backend API method
 * parameters {@link GetStatsBackendOptions} object
 *
 * @param options - Library {@link Client.getStats} method options object
 *
 * @throws Error - If options object invalid
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareGetStatsOptions = (options) => {
    const prepared = {};
    if (options.startAt === undefined && options.endAt === undefined)
        return prepared;
    if (options.startAt === undefined || !(options.startAt instanceof Date)) {
        throw new Error('Field `startAt` must be a Date');
    }
    if (options.endAt === undefined || !(options.endAt instanceof Date)) {
        throw new Error('Field `endAt` must be a Date');
    }
    prepared.start_at = options.startAt.toISOString();
    prepared.end_at = options.endAt.toISOString();
    return prepared;
};
exports.prepareGetStatsOptions = prepareGetStatsOptions;
/**
 * Convert {@link CreateCheckOptions} object to using backend API method
 * parameters {@link CreateCheckBackendOptions} object
 *
 * @param options - Library {@link Client.createCheck} method options object
 *
 * @throws Error - If options object invalid
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareTransferOptions = (options) => {
    if (options.comment !== undefined && options.comment.length > 1024) {
        throw new Error('Comment can\'t be longer than 1024 characters');
    }
    // Create object with required parameters
    const prepared = {
        user_id: options.userId,
        spend_id: options.spendId,
        asset: options.asset,
        amount: typeof options.amount === 'number' ? '' + options.amount : options.amount,
    };
    if (options.disableSendNotification !== undefined) {
        prepared.disable_send_notification = options.disableSendNotification;
    }
    if (options.comment !== undefined)
        prepared.comment = options.comment;
    return prepared;
};
exports.prepareTransferOptions = prepareTransferOptions;
/**
 * Convert {@link CreateCheckOptions} object to using backend API method
 * parameters {@link CreateCheckBackendOptions} object
 *
 * @param options - Library {@link Client.createCheck} method options object
 *
 * @throws Error - If options object invalid
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareCreateCheckOptions = (options) => {
    // Create object with required parameters
    const prepared = {
        asset: options.asset,
        amount: typeof options.amount === 'number' ? '' + options.amount : options.amount,
    };
    if (options.pinToUserId !== undefined)
        prepared.pin_to_user_id = options.pinToUserId;
    if (options.pinToUsername !== undefined)
        prepared.pin_to_username = options.pinToUsername;
    if (options.pinToUserId !== undefined && options.pinToUsername !== undefined) {
        throw new Error('Pass only one of `pinToUserId` and `pinToUsername`');
    }
    return prepared;
};
exports.prepareCreateCheckOptions = prepareCreateCheckOptions;
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
    if (options.description !== undefined && options.description.length > 1024) {
        throw new Error('Description can\'t be longer than 1024 characters');
    }
    if (options.paidBtnName !== undefined && !options.paidBtnUrl) {
        throw new Error('Require paidBtnUrl parameter if paidBtnName parameter pass');
    }
    if (options.hiddenMessage !== undefined && options.hiddenMessage.length > 2048) {
        throw new Error('Hidden message can\'t be longer than 2048 characters');
    }
    if (options.expiresIn !== undefined
        && (typeof options.expiresIn !== 'number'
            || options.expiresIn < 1
            || options.expiresIn > 2678400)) {
        throw new Error('Expires must be a number between 1-2678400');
    }
    let payload;
    if (options.payload !== undefined) {
        if (typeof options.payload === 'string')
            payload = options.payload;
        else
            payload = JSON.stringify(options.payload);
        if (payload.length > 4096) {
            throw new Error('Payload can\'t be longer than 4096 characters');
        }
    }
    // Create object with required parameters
    const prepared = {
        amount: typeof options.amount === 'number' ? '' + options.amount : options.amount,
    };
    const currencyType = options.currencyType || casts_1.CurrencyType.Crypto;
    prepared.currency_type = currencyType;
    if (currencyType === casts_1.CurrencyType.Crypto) {
        const asset = options.asset;
        if (!asset)
            throw new Error('Field `asset` required for crypto currency type');
        prepared.asset = asset;
    }
    if (currencyType === casts_1.CurrencyType.Fiat) {
        const fiat = options.fiat;
        if (!fiat)
            throw new Error('Field `fiat` required for fiat currency type');
        prepared.fiat = fiat;
        if (options.acceptedAssets !== undefined) {
            if (!Array.isArray(options.acceptedAssets)) {
                throw new Error('Field `acceptedAssets` must be array');
            }
            prepared.accepted_assets = options.acceptedAssets.join(',');
        }
    }
    // Same names
    if (options.expiresIn !== undefined)
        prepared.expires_in = options.expiresIn;
    if (options.description !== undefined)
        prepared.description = options.description;
    if (options.hiddenMessage !== undefined)
        prepared.hidden_message = options.hiddenMessage;
    if (payload !== undefined)
        prepared.payload = payload;
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
 * Convert identifier to using backend API delete methods
 *
 * @param id - Passed identifier
 *
 * @throws Error - If options identifier invalid
 *
 * @returns Identifier number
 */
const prepareDeleteOptions = (id) => {
    if (typeof id !== 'number' || isNaN(id) || id < 1) {
        throw new Error('Identifier must be a valid positive number');
    }
    return id;
};
exports.prepareDeleteOptions = prepareDeleteOptions;
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
    if (options.asset !== undefined)
        prepared.asset = options.asset;
    if (options.fiat !== undefined)
        prepared.fiat = options.fiat;
    if (options.ids !== undefined)
        prepared.invoice_ids = options.ids.join(',');
    return prepared;
};
exports.prepareGetInvoicesOptions = prepareGetInvoicesOptions;
/**
 * Convert {@link GetInvoicesPaginateOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoicesPaginate} method options object
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
    if (options.asset !== undefined)
        prepared.asset = options.asset;
    if (options.fiat !== undefined)
        prepared.fiat = options.fiat;
    if (options.ids !== undefined)
        prepared.invoice_ids = options.ids.join(',');
    // Paginate options
    let page = options.page ? +options.page : 1;
    if (page < 1)
        page = 1;
    prepared.count = pageSize;
    prepared.offset = pageSize * (page - 1);
    return prepared;
};
exports.prepareGetInvoicesPaginateOptions = prepareGetInvoicesPaginateOptions;
/**
 * Convert {@link GetChecksOptions} object to using backend API method
 * parameters {@link GetChecksBackendOptions} object
 *
 * @param options - Library {@link Client.getChecks} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareGetChecksOptions = (options) => {
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
    if (options.asset !== undefined)
        prepared.asset = options.asset;
    if (options.ids !== undefined)
        prepared.check_ids = options.ids.join(',');
    return prepared;
};
exports.prepareGetChecksOptions = prepareGetChecksOptions;
/**
 * Convert {@link GetChecksPaginateOptions} object to using backend API method
 * parameters {@link GetChecksBackendOptions} object
 *
 * @param options - Library {@link Client.getChecksPaginate} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareGetChecksPaginateOptions = (pageSize, options) => {
    // Create empty object, method doesn't have required parameters
    const prepared = {};
    // Same names
    if (options.status !== undefined)
        prepared.status = options.status;
    // Different names
    if (options.asset !== undefined)
        prepared.asset = options.asset;
    if (options.ids !== undefined)
        prepared.check_ids = options.ids.join(',');
    // Paginate options
    let page = options.page ? +options.page : 1;
    if (page < 1)
        page = 1;
    prepared.count = pageSize;
    prepared.offset = pageSize * (page - 1);
    return prepared;
};
exports.prepareGetChecksPaginateOptions = prepareGetChecksPaginateOptions;
/**
 * Convert {@link GetTransfersOptions} object to using backend API method
 * parameters {@link GetTransfersBackendOptions} object
 *
 * @param options - Library {@link Client.getTransfers} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareGetTransfersOptions = (options) => {
    // Create empty object, method doesn't have required parameters
    const prepared = {};
    // Same names
    if (options.offset !== undefined)
        prepared.offset = options.offset;
    if (options.count !== undefined)
        prepared.count = options.count;
    // Different names
    if (options.asset !== undefined)
        prepared.asset = options.asset;
    if (options.spendId !== undefined)
        prepared.spend_id = options.spendId;
    if (options.ids !== undefined)
        prepared.transfer_ids = options.ids.join(',');
    return prepared;
};
exports.prepareGetTransfersOptions = prepareGetTransfersOptions;
/**
 * Convert {@link GetTransfersPaginateOptions} object to using backend API method
 * parameters {@link GetTransfersBackendOptions} object
 *
 * @param options - Library {@link Client.getTransfersPaginate} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
const prepareGetTransfersPaginateOptions = (pageSize, options) => {
    // Create empty object, method doesn't have required parameters
    const prepared = {};
    // Different names
    if (options.asset !== undefined)
        prepared.asset = options.asset;
    if (options.spendId !== undefined)
        prepared.spend_id = options.spendId;
    if (options.ids !== undefined)
        prepared.transfer_ids = options.ids.join(',');
    // Paginate options
    let page = options.page ? +options.page : 1;
    if (page < 1)
        page = 1;
    prepared.count = pageSize;
    prepared.offset = pageSize * (page - 1);
    return prepared;
};
exports.prepareGetTransfersPaginateOptions = prepareGetTransfersPaginateOptions;
