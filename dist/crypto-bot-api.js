var CryptoBotAPI = (function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /** Possible currency types */
    var CurrencyType;
    (function (CurrencyType) {
        CurrencyType["Crypto"] = "crypto";
        CurrencyType["Fiat"] = "fiat";
        CurrencyType["Unknown"] = "unknown";
    })(CurrencyType || (CurrencyType = {}));
    /** Possible detailed currency types */
    var DetailedCurrencyType;
    (function (DetailedCurrencyType) {
        DetailedCurrencyType["Blockchain"] = "blockchain";
        DetailedCurrencyType["Stablecoin"] = "stablecoin";
        DetailedCurrencyType["Fiat"] = "fiat";
        DetailedCurrencyType["Unknown"] = "unknown";
    })(DetailedCurrencyType || (DetailedCurrencyType = {}));
    /** Possible invoice statuses */
    var InvoiceStatus;
    (function (InvoiceStatus) {
        InvoiceStatus["Active"] = "active";
        InvoiceStatus["Paid"] = "paid";
        InvoiceStatus["Expired"] = "expired";
        InvoiceStatus["Unknown"] = "unknown";
    })(InvoiceStatus || (InvoiceStatus = {}));
    /** Possible check statuses */
    var CheckStatus;
    (function (CheckStatus) {
        CheckStatus["Active"] = "active";
        CheckStatus["Activated"] = "activated";
        CheckStatus["Unknown"] = "unknown";
    })(CheckStatus || (CheckStatus = {}));
    /** Possible transfer statuses */
    var TransferStatus;
    (function (TransferStatus) {
        TransferStatus["Completed"] = "completed";
        TransferStatus["Unknown"] = "unknown";
    })(TransferStatus || (TransferStatus = {}));
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
    var toBalances = function (input) {
        if (!Array.isArray(input))
            throw new Error("Input is not array: ".concat(JSON.stringify(input)));
        // Conver array to HashMap structure
        return input.reduce(function (accumulator, value) {
            accumulator[value.currency_code] = { available: value.available, onhold: value.onhold };
            return accumulator;
        }, {});
    };
    /**
     * Convert backend API result to library result object to return in
     * {@link Store.getCurrencies} method
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toCurrencies = function (input) {
        if (!Array.isArray(input))
            return {};
        return input.reduce(function (accumulator, value) {
            if (value.code) {
                var code = value.code.toString();
                var type = DetailedCurrencyType.Unknown;
                if (value.is_blockchain)
                    type = DetailedCurrencyType.Blockchain;
                if (value.is_fiat)
                    type = DetailedCurrencyType.Fiat;
                if (value.is_stablecoin)
                    type = DetailedCurrencyType.Stablecoin;
                var currency = {
                    code: code,
                    name: value.name || '',
                    decimals: value.decimals || 0,
                    type: type,
                };
                if (Object.prototype.hasOwnProperty.call(value, 'url'))
                    currency.url = value.url;
                accumulator[code] = currency;
            }
            return accumulator;
        }, {});
    };
    /**
     * Convert backend API result to library result object to return in
     * {@link Store.getExchangeRates} method result
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toExchangeRates = function (input) {
        if (!Array.isArray(input))
            return [];
        return input.map(function (value) { return ({
            source: value.source || '',
            target: value.target || '',
            rate: value.rate,
            isValid: value.is_valid,
        }); });
    };
    /**
     * Convert backend API result to library result object to return in
     * {@link Client.createInvoice} method, {@link toInvoices} function
     * and {@link ClientEmitter} `paid` event emit
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toInvoice = function (input) {
        var invoice = {
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
            var payload = void 0;
            try {
                payload = JSON.parse(input.payload);
            }
            catch (_a) {
                payload = input.payload;
            }
            invoice.payload = payload;
        }
        return invoice;
    };
    /**
     * Convert backend API result to library result object to return in
     * {@link Client.createCheck} method and {@link toChecks} function
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toCheck = function (input) {
        var check = {
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
    /**
     * Convert backend API result to library result object to return in
     * {@link Client.transfer} method and {@link toTransfers} function
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toTransfer = function (input) {
        var transfer = {
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
    /**
     * Convert backend API result to library result object to return in
     * {@link Client.getInvoices} and {@link Client.getInvoicesPaginate}
     * methods
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toInvoices = function (input) {
        var items = [];
        if (Array.isArray(input.items))
            items = input.items.map(toInvoice);
        return items;
    };
    /**
     * Convert backend API result to library result object to return in
     * {@link Client.getChecks} and {@link Client.getChecksPaginate}
     * methods
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toChecks = function (input) {
        var items = [];
        if (Array.isArray(input.items))
            items = input.items.map(toCheck);
        return items;
    };
    /**
     * Convert backend API result to library result object to return in
     * {@link Client.getTransfers} and {@link Client.getTransfersPaginate}
     * methods
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toTransfers = function (input) {
        var items = [];
        if (Array.isArray(input.items))
            items = input.items.map(toTransfer);
        return items;
    };
    /**
     * Convert backend API result to library result object to return in
     * {@link Client.getStats} method
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toStats = function (input) { return ({
        volume: input.volume || '0',
        conversion: input.conversion || '0',
        uniqueUsersCount: input.unique_users_count || 0,
        createdInvoiceCount: input.created_invoice_count || 0,
        paidInvoiceCount: input.paid_invoice_count || 0,
        startAt: new Date(input.start_at ? input.start_at : 0),
        endAt: new Date(input.end_at ? input.end_at : 0),
    }); };
    /**
     * Convert backend API result to library result object to return in
     * {@link Store.getMe} method
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toMe = function (input) { return ({
        id: input.app_id || 0,
        name: input.name || '',
        bot: input.payment_processing_bot_username || '',
    }); };

    /**
     * Return exchange rate to passed currencies pair
     *
     * @param source - Source currency code
     * @param target - Target currency code
     * @param exchangeRates - Exchange rates information from {@link Store.getExchangeRates} method
     *
     * @returns Exchange rate or zero, if currencies pair not exists
     */
    var getExchageRate = function (source, target, exchangeRates) {
        var rate = '';
        for (var i = 0, l = exchangeRates.length; i < l; i += 1) {
            var exchangeRate = exchangeRates[i];
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
    /**
     * Url check reguar expression
     */
    var URL_CHECK_REGEXP = /^https?:\/\/((([a-z\d][a-z\d-]*[a-z\d])\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*$/i;
    /**
     * Check is string is valid url
     *
     * @param input - String
     *
     * @returns Check result
     */
    var isValidUrl = function (input) { return URL_CHECK_REGEXP.test(input); };
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
    var prepareGetStatsOptions = function (options) {
        var prepared = {};
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
    var prepareTransferOptions = function (options) {
        if (options.comment !== undefined && options.comment.length > 1024) {
            throw new Error('Comment can\'t be longer than 1024 characters');
        }
        // Create object with required parameters
        var prepared = {
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
    var prepareCreateCheckOptions = function (options) {
        // Create object with required parameters
        var prepared = {
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
    var prepareCreateInvoiceOptions = function (options) {
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
        var payload;
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
        var prepared = {
            amount: typeof options.amount === 'number' ? '' + options.amount : options.amount,
        };
        var currencyType = options.currencyType || CurrencyType.Crypto;
        prepared.currency_type = currencyType;
        if (currencyType === CurrencyType.Crypto) {
            var asset = options.asset;
            if (!asset)
                throw new Error('Field `asset` required for crypto currency type');
            prepared.asset = asset;
        }
        if (currencyType === CurrencyType.Fiat) {
            var fiat = options.fiat;
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
    /**
     * Convert identifier to using backend API delete methods
     *
     * @param id - Passed identifier
     *
     * @throws Error - If options identifier invalid
     *
     * @returns Identifier number
     */
    var prepareDeleteOptions = function (id) {
        if (typeof id !== 'number' || isNaN(id) || id < 1) {
            throw new Error('Identifier must be a valid positive number');
        }
        return id;
    };
    /**
     * Convert {@link GetInvoicesOptions} object to using backend API method
     * parameters {@link GetInvoicesBackendOptions} object
     *
     * @param options - Library {@link Client.getInvoices} method options object
     *
     * @returns Object with corresponding backend API method parameters
     */
    var prepareGetInvoicesOptions = function (options) {
        // Create empty object, method doesn't have required parameters
        var prepared = {};
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
    /**
     * Convert {@link GetInvoicesPaginateOptions} object to using backend API method
     * parameters {@link GetInvoicesBackendOptions} object
     *
     * @param options - Library {@link Client.getInvoicesPaginate} method options object
     *
     * @returns Object with corresponding backend API method parameters
     */
    var prepareGetInvoicesPaginateOptions = function (pageSize, options) {
        // Create empty object, method doesn't have required parameters
        var prepared = {};
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
        var page = options.page ? +options.page : 1;
        if (page < 1)
            page = 1;
        prepared.count = pageSize;
        prepared.offset = pageSize * (page - 1);
        return prepared;
    };
    /**
     * Convert {@link GetChecksOptions} object to using backend API method
     * parameters {@link GetChecksBackendOptions} object
     *
     * @param options - Library {@link Client.getChecks} method options object
     *
     * @returns Object with corresponding backend API method parameters
     */
    var prepareGetChecksOptions = function (options) {
        // Create empty object, method doesn't have required parameters
        var prepared = {};
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
    /**
     * Convert {@link GetChecksPaginateOptions} object to using backend API method
     * parameters {@link GetChecksBackendOptions} object
     *
     * @param options - Library {@link Client.getChecksPaginate} method options object
     *
     * @returns Object with corresponding backend API method parameters
     */
    var prepareGetChecksPaginateOptions = function (pageSize, options) {
        // Create empty object, method doesn't have required parameters
        var prepared = {};
        // Same names
        if (options.status !== undefined)
            prepared.status = options.status;
        // Different names
        if (options.asset !== undefined)
            prepared.asset = options.asset;
        if (options.ids !== undefined)
            prepared.check_ids = options.ids.join(',');
        // Paginate options
        var page = options.page ? +options.page : 1;
        if (page < 1)
            page = 1;
        prepared.count = pageSize;
        prepared.offset = pageSize * (page - 1);
        return prepared;
    };
    /**
     * Convert {@link GetTransfersOptions} object to using backend API method
     * parameters {@link GetTransfersBackendOptions} object
     *
     * @param options - Library {@link Client.getTransfers} method options object
     *
     * @returns Object with corresponding backend API method parameters
     */
    var prepareGetTransfersOptions = function (options) {
        // Create empty object, method doesn't have required parameters
        var prepared = {};
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
    /**
     * Convert {@link GetTransfersPaginateOptions} object to using backend API method
     * parameters {@link GetTransfersBackendOptions} object
     *
     * @param options - Library {@link Client.getTransfersPaginate} method options object
     *
     * @returns Object with corresponding backend API method parameters
     */
    var prepareGetTransfersPaginateOptions = function (pageSize, options) {
        // Create empty object, method doesn't have required parameters
        var prepared = {};
        // Different names
        if (options.asset !== undefined)
            prepared.asset = options.asset;
        if (options.spendId !== undefined)
            prepared.spend_id = options.spendId;
        if (options.ids !== undefined)
            prepared.transfer_ids = options.ids.join(',');
        // Paginate options
        var page = options.page ? +options.page : 1;
        if (page < 1)
            page = 1;
        prepared.count = pageSize;
        prepared.offset = pageSize * (page - 1);
        return prepared;
    };

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
    var request = function (url, apiKey) { return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Crypto-Pay-API-Token', apiKey);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4)
                return;
            resolve(xhr.responseText);
        };
        xhr.onerror = function () {
            reject(new Error('Network Error'));
        };
        xhr.send();
    }); };

    /**
     * Make backend API calls
     */
    var Transport = /** @class */ (function () {
        /**
         * Create class instance
         *
         * @param apiKey - Crypto Bot API key, looks like '1234:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
         * @param endpoint - API endpoint url or 'mainnet' or 'testnet'
         *                   for hardcoded in library endpoint urls
         *
         * @throws Error - If passed invalid API key or endpoint
         */
        function Transport(apiKey, endpoint) {
            if (!Transport.KEY_CHECK_REGEXP.test(apiKey)) {
                throw new Error('API key looks like invalid');
            }
            var url;
            if (endpoint === 'mainnet') {
                url = 'https://pay.crypt.bot/api';
            }
            else if (endpoint === 'testnet') {
                url = 'https://testnet-pay.crypt.bot/api';
            }
            else if (!isValidUrl(endpoint)) {
                throw new Error('Endpoint parameter not contain valid URL');
            }
            else {
                url = endpoint;
            }
            this._apiKey = apiKey;
            this._baseUrl = "".concat(url, "/");
        }
        /**
         * Make request to backend API, handle errors and return result
         *
         * @param method - Backend API method name
         * @param parameters - Method parameters object
         *
         * @throws Error - If response have errors
         *
         * @returns Promise, what resolved to API response `result` field
         */
        Transport.prototype.call = function (method, parameters) {
            // Format url query part from passed parameters object
            var qs = '';
            if (parameters) {
                Object.keys(parameters).forEach(function (name) {
                    var value = parameters[name];
                    if (Array.isArray(value))
                        value = value.join(',');
                    else
                        value = value.toString();
                    qs += "&".concat(name, "=").concat(encodeURIComponent(value));
                });
            }
            return request(this._baseUrl + method + (qs.length ? "?".concat(qs.substr(1)) : ''), this._apiKey)
                .then(function (rawResponse) {
                var response;
                try {
                    response = JSON.parse(rawResponse);
                }
                catch (_a) {
                    throw new Error("Response parse error, raw reponse:\n".concat(rawResponse));
                }
                if (response.ok !== true) {
                    if (!response.error)
                        throw new Error('Api response unknown error');
                    throw new Error("Api response error ".concat(JSON.stringify(response.error)));
                }
                return response.result;
            });
        };
        /** RegExp to check API key */
        Transport.KEY_CHECK_REGEXP = /\d{1,}:[a-zA-Z0-9]{35}/;
        return Transport;
    }());

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
    var createFetchHandler = function (transport, method, castFn, updatePeriod) {
        var promise = null;
        var prevUpdateStamp = 0;
        var data;
        return function (isForce) {
            if (isForce === void 0) { isForce = false; }
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
            var updateStamp = Math.floor(+(new Date()) / 1000 / updatePeriod);
            if (updateStamp === prevUpdateStamp && !isForce) {
                return Promise.resolve(data);
            }
            prevUpdateStamp = updateStamp;
            promise = transport.call(method).then(function (value) {
                data = castFn(value);
                promise = null;
                return data;
            });
            return promise;
        };
    };
    // Because `tsdoc` not support `@category` tag, but `typedoc` support
    /* eslint-disable tsdoc/syntax */
    /**
     * Wrapper for API methods that return possible cached data
     *
     * @category External
     */
    /* eslint-enable tsdoc/syntax */
    var Store = /** @class */ (function () {
        /**
         * Create class instance
         *
         * @param apiKey - Crypto Bot API key, looks like '1234:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
         * @param endpoint - API endpoint url or 'mainnet' or 'testnet'
         *                   for hardcoded in library endpoint urls
         *
         * @throws Error - If passed invalid API key or endpoint
         */
        function Store(apiKey, endpoint) {
            if (endpoint === void 0) { endpoint = 'mainnet'; }
            this._transport = new Transport(apiKey, endpoint);
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
        Store.prototype.getCurrencies = function (isForce) {
            if (!this._currenciesFetchHandler) {
                this._currenciesFetchHandler = createFetchHandler(this._transport, 'getCurrencies', toCurrencies, Store._CURRENCIES_UPDATE_PERIOD);
            }
            return this._currenciesFetchHandler(isForce);
        };
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
        Store.prototype.getExchangeRates = function (isForce) {
            if (!this._exchangeRatesFetchHandler) {
                this._exchangeRatesFetchHandler = createFetchHandler(this._transport, 'getExchangeRates', toExchangeRates, Store._EXCHANGE_RATES_UPDATE_PERIOD);
            }
            return this._exchangeRatesFetchHandler(isForce);
        };
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
        Store.prototype.getMe = function (isForce) {
            if (isForce === void 0) { isForce = false; }
            if (!this._meFetchHandler) {
                this._meFetchHandler = createFetchHandler(this._transport, 'getMe', toMe, Store._ME_UPDATE_PERIOD);
            }
            return this._meFetchHandler(isForce);
        };
        /** Update period for fetching currencies from backend API in seconds */
        Store._CURRENCIES_UPDATE_PERIOD = 3600;
        /** Update period for fetching exhange rates from backend API in seconds */
        Store._EXCHANGE_RATES_UPDATE_PERIOD = 60;
        /** Update period for fetching app infomation from backend API in seconds */
        Store._ME_UPDATE_PERIOD = 3600;
        return Store;
    }());

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
    var Client = /** @class */ (function (_super) {
        __extends(Client, _super);
        function Client() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** Page size for {@link Client.getInvoicesPaginate} method */
            _this._pageSize = 100;
            return _this;
        }
        /**
         * Return count invoices per page for {@link Client.getInvoicesPaginate} method
         */
        Client.prototype.getPageSize = function () {
            return this._pageSize;
        };
        /**
         * Set count invoices per page for {@link Client.getInvoicesPaginate} method
         *
         * @param pageSizeParam - Invoices per page
         *
         * @throws Error - If `pageSize` parameter is invalid
         */
        Client.prototype.setPageSize = function (pageSizeParam) {
            var pageSize = +pageSizeParam;
            if (pageSize > 1000 || pageSize < 1) {
                throw Error('Page size may be from 1 to 1000');
            }
            this._pageSize = pageSize;
        };
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
        Client.prototype.getStats = function (options) {
            if (options === void 0) { options = {}; }
            return this._transport.call('getStats', prepareGetStatsOptions(options))
                .then(function (result) { return toStats(result); });
        };
        /**
         * Get API app balances infomation
         *
         * Use {@link toBalances} backend API result convert function
         *
         * @throws Error - If there is an error sending request to backend API or parsing response
         *
         * @returns Promise, what resolved to API app balances infomation object
         */
        Client.prototype.getBalances = function () {
            return this._transport.call('getBalance').then(function (result) { return toBalances(result); });
        };
        /**
         * Get API app balances infomation
         *
         * Use {@link toBalances} backend API result convert function
         *
         * @throws Error - If there is an error sending request to backend API or parsing response
         *
         * @returns Promise, what resolved to API app available balances infomation object
         */
        Client.prototype.getBalancesAvailable = function () {
            return this.getBalances()
                .then(function (balances) {
                return Object.entries(balances).reduce(function (accumulator, entry) {
                    var code = entry[0], balance = entry[1];
                    accumulator[code] = balance.available;
                    return accumulator;
                }, {});
            });
        };
        /**
         * Get API app balances infomation
         *
         * Use {@link toBalances} backend API result convert function
         *
         * @throws Error - If there is an error sending request to backend API or parsing response
         *
         * @returns Promise, what resolved to API app balances on hold infomation object
         */
        Client.prototype.getBalancesOnhold = function () {
            return this.getBalances()
                .then(function (balances) {
                return Object.entries(balances).reduce(function (accumulator, entry) {
                    var code = entry[0], balance = entry[1];
                    accumulator[code] = balance.onhold;
                    return accumulator;
                }, {});
            });
        };
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
        Client.prototype.getBalance = function (currencyCode) {
            return this.getBalances()
                .then(function (balances) {
                if (balances[currencyCode] === undefined)
                    return { available: '0', onhold: '0' };
                return balances[currencyCode];
            });
        };
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
        Client.prototype.getBalanceAvailable = function (currencyCode) {
            return this.getBalances()
                .then(function (balances) {
                if (balances[currencyCode] === undefined)
                    return '0';
                return balances[currencyCode].available;
            });
        };
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
        Client.prototype.getBalanceOnhold = function (currencyCode) {
            return this.getBalances()
                .then(function (balances) {
                if (balances[currencyCode] === undefined)
                    return '0';
                return balances[currencyCode].onhold;
            });
        };
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
        Client.prototype.getCurrency = function (currencyCode, isForce) {
            if (isForce === void 0) { isForce = false; }
            return this.getCurrencies(isForce)
                .then(function (currencies) {
                if (currencies[currencyCode] === undefined)
                    return null;
                return currencies[currencyCode];
            });
        };
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
        Client.prototype.getExchangeRate = function (source, target, isForce) {
            if (isForce === void 0) { isForce = false; }
            return this.getExchangeRates(isForce)
                .then(function (exchangeRates) {
                return getExchageRate(source, target, exchangeRates);
            });
        };
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
        Client.prototype.transfer = function (options) {
            return this._transport.call('transfer', prepareTransferOptions(options))
                .then(function (result) { return toTransfer(result); });
        };
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
        Client.prototype.createInvoice = function (options) {
            return this._transport.call('createInvoice', prepareCreateInvoiceOptions(options))
                .then(function (result) { return toInvoice(result); });
        };
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
        Client.prototype.createCheck = function (options) {
            return this._transport.call('createCheck', prepareCreateCheckOptions(options))
                .then(function (result) { return toCheck(result); });
        };
        /**
         * Delete invoice
         *
         * @param id - Invoice identifier
         *
         * @throws Error - If there is an error sending request to backend API or parsing response error
         *
         * @returns Promise, what resolved to boolean operation result status
         */
        Client.prototype.deleteInvoice = function (id) {
            return this._transport.call('deleteInvoice', { invoice_id: prepareDeleteOptions(id) });
        };
        /**
         * Delete check
         *
         * @param id - Check identifier
         *
         * @throws Error - If there is an error sending request to backend API or parsing response error
         *
         * @returns Promise, what resolved to boolean operation result status
         */
        Client.prototype.deleteCheck = function (id) {
            return this._transport.call('deleteCheck', { check_id: prepareDeleteOptions(id) });
        };
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
        Client.prototype.getInvoices = function (options) {
            if (options === void 0) { options = {}; }
            return this._transport.call('getInvoices', prepareGetInvoicesOptions(options))
                .then(function (result) { return toInvoices(result); });
        };
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
        Client.prototype.getInvoicesPaginate = function (options) {
            if (options === void 0) { options = {}; }
            var prepared = prepareGetInvoicesPaginateOptions(this._pageSize, options);
            return this._transport.call('getInvoices', prepared)
                .then(function (result) { return toInvoices(result); });
        };
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
        Client.prototype.getChecks = function (options) {
            if (options === void 0) { options = {}; }
            return this._transport.call('getChecks', prepareGetChecksOptions(options))
                .then(function (result) { return toChecks(result); });
        };
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
        Client.prototype.getChecksPaginate = function (options) {
            if (options === void 0) { options = {}; }
            var prepared = prepareGetChecksPaginateOptions(this._pageSize, options);
            return this._transport.call('getChecks', prepared)
                .then(function (result) { return toChecks(result); });
        };
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
        Client.prototype.getTransfers = function (options) {
            if (options === void 0) { options = {}; }
            return this._transport.call('getTransfers', prepareGetTransfersOptions(options))
                .then(function (result) { return toTransfers(result); });
        };
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
        Client.prototype.getTransfersPaginate = function (options) {
            if (options === void 0) { options = {}; }
            var prepared = prepareGetTransfersPaginateOptions(this._pageSize, options);
            return this._transport.call('getTransfers', prepared)
                .then(function (result) { return toTransfers(result); });
        };
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
        Client.prototype.call = function (method, options) {
            if (options === void 0) { options = {}; }
            return this._transport.call(method, options);
        };
        /**
         * Access to {@link CurrencyType} enumeration, used in {@link Invoice} type
         */
        Client.CurrencyType = CurrencyType;
        /**
       * Access to {@link DetailedCurrencyType} enumeration, used in {@link Store.getCurrencies}
       * and {@link Client.getCurrency} methods results
       */
        Client.DetailedCurrencyType = DetailedCurrencyType;
        /**
         * Access to {@link InvoiceStatus} enumeration, used in {@link Invoice} type,
         * {@link Client.getInvoices} and {@link Client.getInvoicesPaginate} methods options
         */
        Client.InvoiceStatus = InvoiceStatus;
        /**
         * Access to {@link CheckStatus} enumeration, used in {@link Check} type,
         * {@link Client.getChecks} and {@link Client.getChecksPaginate} methods options
         */
        Client.CheckStatus = CheckStatus;
        /**
         * Access to {@link TransferStatus} enumeration, used in {@link Transfer} type,
         * {@link Client.getTransfers} and {@link Client.getTransfersPaginate} methods options
         */
        Client.TransferStatus = TransferStatus;
        return Client;
    }(Store));

    return Client;

})();
//# sourceMappingURL=crypto-bot-api.js.map
