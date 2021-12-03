"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMe = exports.toInvoicesPaginated = exports.toInvoices = exports.toInvoice = exports.toExchangeRates = exports.toCurrencies = exports.toBalances = void 0;
const utils_1 = require("./utils");
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getBalances} method
 *
 * @param input - Backend API result
 * @param currencies - Currencies information from {@link Store.getCurrencies} method,
 *                     need to correct format output in coins by currencies decimals counts
 * @param isReturnInNanos - If true, return raw balances in nanos,
 *                          else return converted to coins balances
 *
 * @returns Converted result
 */
const toBalances = (input, currencies, isReturnInNanos) => {
    if (!Array.isArray(input))
        return {};
    // Conver array to HashMap structure
    return input.reduce((accumulator, value) => {
        if (value.currency_code && value.available) {
            accumulator[value.currency_code] = isReturnInNanos ? value.available : (0, utils_1.nonosToCoins)(value.available, value.currency_code, currencies);
        }
        return accumulator;
    }, {});
};
exports.toBalances = toBalances;
/**
 * Convert backend API result to library result object to return in
 * {@link Store.getCurrencies} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toCurrencies = (input) => {
    if (!Array.isArray(input))
        return {};
    return input.reduce((accumulator, value) => {
        if (value.code) {
            const code = value.code.toString();
            let type;
            if (value.is_blockchain)
                type = 'blockchain';
            if (value.is_fiat)
                type = 'fiat';
            if (value.is_stablecoin)
                type = 'stablecoin';
            const currency = {
                name: value.name || '',
                decimals: value.decimals || 0,
                type,
            };
            accumulator[code] = currency;
        }
        return accumulator;
    }, {});
};
exports.toCurrencies = toCurrencies;
/**
 * Convert backend API result to library result object to return in
 * {@link Store.getExchangeRates} method result
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toExchangeRates = (input) => {
    if (!Array.isArray(input))
        return [];
    return input.map((value) => ({
        source: value.source || '',
        target: value.target || '',
        rate: parseFloat(value.rate),
    }));
};
exports.toExchangeRates = toExchangeRates;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.createInvoice} method, {@link toInvoices} function
 * and {@link ClientEmitter} `paid` event emit
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toInvoice = (input) => {
    const invoice = {
        id: input.invoice_id || 0,
        status: input.status || '',
        hash: input.hash || '',
        currency: input.asset || '',
        amount: parseFloat(input.amount) || 0,
        payUrl: input.pay_url || '',
        isAllowComments: input.allow_comments || false,
        isAllowAnonymous: input.allow_anonymous || false,
        createdAt: new Date(input.created_at),
    };
    if (input.paid_anonymously !== undefined)
        invoice.isPaidAnonymously = input.paid_anonymously;
    if (input.paid_at !== undefined)
        invoice.paidAt = new Date(input.paid_at);
    if (input.description !== undefined)
        invoice.description = input.description;
    if (input.paid_btn_name !== undefined)
        invoice.paidBtnName = input.paid_btn_name;
    if (input.paid_btn_url !== undefined)
        invoice.paidBtnUrl = input.paid_btn_url;
    if (input.comment !== undefined)
        invoice.comment = input.comment;
    if (input.payload !== undefined) {
        let payload;
        try {
            payload = JSON.parse(input.payload);
        }
        catch (err) {
            payload = input.payload;
        }
        invoice.payload = payload;
    }
    return invoice;
};
exports.toInvoice = toInvoice;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getInvoices} and {@link Client.getInvoicesPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toInvoices = (input) => {
    let items = [];
    if (Array.isArray(input.items))
        items = input.items.map(exports.toInvoice);
    return {
        count: input.count || 0,
        items,
    };
};
exports.toInvoices = toInvoices;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getInvoicesPaginate} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toInvoicesPaginated = (page, pageSize, input) => {
    let items = [];
    if (Array.isArray(input.items))
        items = input.items.map(exports.toInvoice);
    return {
        page,
        pagesCount: Math.ceil((input.count || 0) / pageSize),
        items,
    };
};
exports.toInvoicesPaginated = toInvoicesPaginated;
/**
 * Convert backend API result to library result object to return in
 * {@link Store.getMe} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toMe = (input) => ({
    id: input.app_id || 0,
    name: input.name || '',
    bot: input.payment_processing_bot_username || '',
});
exports.toMe = toMe;
