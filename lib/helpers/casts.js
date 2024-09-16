"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMe = exports.toStats = exports.toTransfers = exports.toChecks = exports.toInvoices = exports.toTransfer = exports.toCheck = exports.toInvoice = exports.toExchangeRates = exports.toCurrencies = exports.toBalances = exports.TransferStatus = exports.CheckStatus = exports.InvoiceStatus = exports.DetailedCurrencyType = exports.CurrencyType = void 0;
/** Possible currency types */
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["Crypto"] = "crypto";
    CurrencyType["Fiat"] = "fiat";
    CurrencyType["Unknown"] = "unknown";
})(CurrencyType || (exports.CurrencyType = CurrencyType = {}));
/** Possible detailed currency types */
var DetailedCurrencyType;
(function (DetailedCurrencyType) {
    DetailedCurrencyType["Blockchain"] = "blockchain";
    DetailedCurrencyType["Stablecoin"] = "stablecoin";
    DetailedCurrencyType["Fiat"] = "fiat";
    DetailedCurrencyType["Unknown"] = "unknown";
})(DetailedCurrencyType || (exports.DetailedCurrencyType = DetailedCurrencyType = {}));
/** Possible invoice statuses */
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["Active"] = "active";
    InvoiceStatus["Paid"] = "paid";
    InvoiceStatus["Expired"] = "expired";
    InvoiceStatus["Unknown"] = "unknown";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
/** Possible check statuses */
var CheckStatus;
(function (CheckStatus) {
    CheckStatus["Active"] = "active";
    CheckStatus["Activated"] = "activated";
    CheckStatus["Unknown"] = "unknown";
})(CheckStatus || (exports.CheckStatus = CheckStatus = {}));
/** Possible transfer statuses */
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["Completed"] = "completed";
    TransferStatus["Unknown"] = "unknown";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getBalances} method
 *
 * @param input - Backend API result
 *
 * @throws Error - If input parameter is not array
 *
 * @returns Converted result
 */
const toBalances = (input) => {
    if (!Array.isArray(input))
        throw new Error(`Input is not array: ${JSON.stringify(input)}`);
    // Conver array to HashMap structure
    return input.reduce((accumulator, value) => {
        accumulator[value.currency_code] = { available: value.available, onhold: value.onhold };
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
            let type = DetailedCurrencyType.Unknown;
            if (value.is_blockchain)
                type = DetailedCurrencyType.Blockchain;
            if (value.is_fiat)
                type = DetailedCurrencyType.Fiat;
            if (value.is_stablecoin)
                type = DetailedCurrencyType.Stablecoin;
            const currency = {
                code: code,
                name: value.name || '',
                decimals: value.decimals || 0,
                type,
            };
            if (Object.prototype.hasOwnProperty.call(value, 'url'))
                currency.url = value.url;
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
        rate: value.rate,
        isValid: value.is_valid,
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
        status: input.status || InvoiceStatus.Unknown,
        hash: input.hash || '',
        currencyType: input.currency_type || '',
        currency: input.asset || input.fiat || '',
        amount: input.amount || '0',
        isAllowComments: input.allow_comments || false,
        isAllowAnonymous: input.allow_anonymous || false,
        createdAt: new Date(input.created_at),
        botPayUrl: input.bot_invoice_url || '',
        miniAppPayUrl: input.mini_app_invoice_url || '',
        webAppPayUrl: input.web_app_invoice_url || '',
    };
    if (invoice.currencyType === CurrencyType.Crypto) {
        invoice.currency = input.asset || '';
    }
    if (invoice.currencyType === CurrencyType.Fiat) {
        invoice.currency = input.fiat || '';
    }
    if (input.hidden_message !== undefined)
        invoice.hiddenMessage = input.hidden_message;
    if (input.paid_anonymously !== undefined)
        invoice.isPaidAnonymously = input.paid_anonymously;
    if (input.expiration_date !== undefined)
        invoice.expirationDate = new Date(input.expiration_date);
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
    if (input.paid_usd_rate !== undefined)
        invoice.usdRate = parseFloat(input.paid_usd_rate) || 0;
    if (input.fee_asset !== undefined)
        invoice.feeAsset = input.fee_asset || '';
    if (input.fee_amount !== undefined)
        invoice.fee = input.fee_amount || 0;
    if (input.accepted_assets !== undefined)
        invoice.acceptedAssets = input.accepted_assets;
    if (input.paid_asset !== undefined)
        invoice.paidAsset = input.paid_asset || '';
    if (input.paid_amount !== undefined)
        invoice.paidAmount = parseFloat(input.paid_amount) || 0;
    if (input.paid_fiat_rate !== undefined)
        invoice.paidFiatRate = parseFloat(input.paid_fiat_rate) || 0;
    if (input.payload !== undefined) {
        let payload;
        try {
            payload = JSON.parse(input.payload);
        }
        catch {
            payload = input.payload;
        }
        invoice.payload = payload;
    }
    return invoice;
};
exports.toInvoice = toInvoice;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.createCheck} method and {@link toChecks} function
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toCheck = (input) => {
    const check = {
        id: input.check_id || 0,
        hash: input.hash || '',
        asset: input.asset || '',
        amount: input.amount || '0',
        botCheckUrl: input.bot_check_url || '',
        status: input.status || CheckStatus.Unknown,
        createdAt: new Date(input.created_at),
    };
    if (input.activated_at !== undefined)
        check.activatedAt = new Date(input.activated_at);
    if (input.pin_to_user !== undefined && input.pin_to_user.pin_by !== undefined) {
        if (input.pin_to_user.pin_by === 'id' && input.pin_to_user.user_id !== undefined) {
            check.pinToUserId = input.pin_to_user.user_id;
        }
        if (input.pin_to_user.pin_by === 'username' && input.pin_to_user.username !== undefined) {
            check.pinToUsername = input.pin_to_user.username;
        }
    }
    return check;
};
exports.toCheck = toCheck;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.transfer} method and {@link toTransfers} function
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toTransfer = (input) => {
    const transfer = {
        id: input.transfer_id || 0,
        userId: input.user_id || 0,
        asset: input.asset || '',
        amount: input.amount || '0',
        status: input.status || TransferStatus.Unknown,
        completedAt: new Date(input.completed_at),
    };
    if (input.spend_id !== undefined)
        transfer.spendId = input.spend_id;
    if (input.comment !== undefined)
        transfer.comment = input.comment;
    return transfer;
};
exports.toTransfer = toTransfer;
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
    return items;
};
exports.toInvoices = toInvoices;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getChecks} and {@link Client.getChecksPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toChecks = (input) => {
    let items = [];
    if (Array.isArray(input.items))
        items = input.items.map(exports.toCheck);
    return items;
};
exports.toChecks = toChecks;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getTransfers} and {@link Client.getTransfersPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toTransfers = (input) => {
    let items = [];
    if (Array.isArray(input.items))
        items = input.items.map(exports.toTransfer);
    return items;
};
exports.toTransfers = toTransfers;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getStats} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
const toStats = (input) => ({
    volume: input.volume || '0',
    conversion: input.conversion || '0',
    uniqueUsersCount: input.unique_users_count || 0,
    createdInvoiceCount: input.created_invoice_count || 0,
    paidInvoiceCount: input.paid_invoice_count || 0,
    startAt: new Date(input.start_at ? input.start_at : 0),
    endAt: new Date(input.end_at ? input.end_at : 0),
});
exports.toStats = toStats;
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
