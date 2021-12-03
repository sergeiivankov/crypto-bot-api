var CryptoBotAPI = (function () {
    'use strict';

    /*! *****************************************************************************
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
    /* global Reflect, Promise */

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
    var getExchageRate = function (source, target, exchangeRates, currencies) {
        var _a;
        var rate = NaN;
        for (var i = 0, l = exchangeRates.length; i < l; i += 1) {
            var exchangeRate = exchangeRates[i];
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
        var numberOfNanosSigns = ((_a = currencies[target]) === null || _a === void 0 ? void 0 : _a.decimals) || 8;
        return parseFloat(rate.toFixed(numberOfNanosSigns));
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
    var nonosToCoins = function (value, currencyCode, currencies) {
        var _a;
        var result = value;
        // Use default value as `8` if decimals property is lost
        var numberOfNanosSigns = ((_a = currencies[currencyCode]) === null || _a === void 0 ? void 0 : _a.decimals) || 8;
        var zerosNeed = numberOfNanosSigns - result.length;
        if (zerosNeed > 0) {
            var zeros = '';
            for (var i = 0; i < zerosNeed; i += 1)
                zeros += '0';
            result = zeros + result;
        }
        if (result.length === numberOfNanosSigns)
            result = "0.".concat(result);
        else {
            var pointPosition = result.length - numberOfNanosSigns;
            result = "".concat(result.substr(0, pointPosition), ".").concat(result.substr(pointPosition));
        }
        // Remove trailing zeros
        return result.replace(/0+$/, '');
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
        if (options.description && options.description.length > 1024) {
            throw new Error('Description can\'t be longer than 1024 characters');
        }
        if (options.paidBtnName && !options.paidBtnUrl) {
            throw new Error('Require paidBtnUrl parameter if paidBtnName parameter pass');
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
            asset: options.currency,
            amount: +options.amount,
        };
        // Same names
        if (options.description !== undefined)
            prepared.description = options.description;
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
        if (options.currency !== undefined)
            prepared.asset = options.currency;
        if (options.ids !== undefined) {
            prepared.invoices_ids = options.ids.map(function (value) { return +value; });
        }
        return prepared;
    };
    /**
     * Convert {@link GetInvoicesPaginateOptions} object to using backend API method
     * parameters {@link GetInvoicesBackendOptions} object
     *
     * @param options - Library {@link Client.getInvoices} method options object
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
        if (options.currency !== undefined)
            prepared.asset = options.currency;
        if (options.ids !== undefined) {
            prepared.invoices_ids = options.ids.map(function (value) { return +value; });
        }
        // Paginate options
        var page = options.page ? +options.page : 1;
        if (page < 1)
            page = 1;
        prepared.count = pageSize;
        prepared.offset = pageSize * (page - 1);
        return prepared;
    };

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
    var toBalances = function (input, currencies, isReturnInNanos) {
        if (!Array.isArray(input))
            return {};
        // Conver array to HashMap structure
        return input.reduce(function (accumulator, value) {
            if (value.currency_code && value.available) {
                accumulator[value.currency_code] = isReturnInNanos ? value.available : nonosToCoins(value.available, value.currency_code, currencies);
            }
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
                var type = void 0;
                if (value.is_blockchain)
                    type = 'blockchain';
                if (value.is_fiat)
                    type = 'fiat';
                if (value.is_stablecoin)
                    type = 'stablecoin';
                var currency = {
                    name: value.name || '',
                    decimals: value.decimals || 0,
                    type: type,
                };
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
            rate: parseFloat(value.rate),
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
            var payload = void 0;
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
        return {
            count: input.count || 0,
            items: items,
        };
    };
    /**
     * Convert backend API result to library result object to return in
     * {@link Client.getInvoicesPaginate} method
     *
     * @param input - Backend API result
     *
     * @returns Converted result
     */
    var toInvoicesPaginated = function (page, pageSize, input) {
        var items = [];
        if (Array.isArray(input.items))
            items = input.items.map(toInvoice);
        return {
            page: page,
            pagesCount: Math.ceil((input.count || 0) / pageSize),
            items: items,
        };
    };
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
            // Mainnet disabled during api testing stage
            if (endpoint === 'mainnet' || endpoint === 'https://pay.crypt.bot/api') {
                throw new Error('Mainnet disabled during api testing stage,'
                    + "pass 'testnet' or endpoint url in second parameter");
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
                catch (err) {
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
         * @param pageSize - Invoices per page
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
        Client.prototype.getBalances = function (isReturnInNanos, isForce) {
            if (isReturnInNanos === void 0) { isReturnInNanos = false; }
            if (isForce === void 0) { isForce = false; }
            return Promise.all([this.getCurrencies(isForce), this._transport.call('getBalance')])
                // eslint-disable-next-line arrow-body-style
                .then(function (_a) {
                var currencies = _a[0], balancesResponse = _a[1];
                return toBalances(balancesResponse, currencies, isReturnInNanos);
            });
        };
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
        Client.prototype.getBalance = function (currencyCode, isReturnInNanos, isForce) {
            if (isReturnInNanos === void 0) { isReturnInNanos = false; }
            if (isForce === void 0) { isForce = false; }
            return this.getBalances(isReturnInNanos, isForce)
                .then(function (balances) {
                if (balances[currencyCode] === undefined)
                    return '0';
                return balances[currencyCode];
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
            return Promise.all([this.getCurrencies(isForce), this.getExchangeRates(isForce)])
                // eslint-disable-next-line arrow-body-style
                .then(function (_a) {
                var currencies = _a[0], exchangeRates = _a[1];
                return getExchageRate(source, target, exchangeRates, currencies);
            });
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
        Client.prototype.getInvoicesPaginate = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var prepared = prepareGetInvoicesPaginateOptions(this._pageSize, options);
            return this._transport.call('getInvoices', prepared)
                // eslint-disable-next-line arrow-body-style
                .then(function (result) {
                return toInvoicesPaginated(options.page, _this._pageSize, result);
            });
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
        return Client;
    }(Store));

    return Client;

})();
//# sourceMappingURL=crypto-bot-api.js.map
