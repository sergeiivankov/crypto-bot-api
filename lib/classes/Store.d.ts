import { Currencies, ExchangeRates, Me } from '../helpers/casts';
import { ApiMethod } from '../helpers/utils';
import Transport from './Transport';
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
export declare const createFetchHandler: <T>(transport: Transport, method: ApiMethod, castFn: (value: any) => T, updatePeriod: number) => (isForce?: boolean) => Promise<T>;
/**
 * Wrapper for API methods that return possible cached data
 *
 * @category External
 */
export default class Store {
    /** Update period for fetching currencies from backend API in seconds */
    private static _CURRENCIES_UPDATE_PERIOD;
    /** Update period for fetching exhange rates from backend API in seconds */
    private static _EXCHANGE_RATES_UPDATE_PERIOD;
    /** Update period for fetching app infomation from backend API in seconds */
    private static _ME_UPDATE_PERIOD;
    /** Transport class instance */
    protected _transport: Transport;
    /**
     * {@link Store.getCurrencies} method fetch data handler,
     * see {@link createFetchHandler} for more
     */
    private _currenciesFetchHandler;
    /**
     * {@link Store.getExchangeRates} method fetch data handler,
     * see {@link createFetchHandler} for more
     */
    private _exchangeRatesFetchHandler;
    /**
     * {@link Store.getMe} method fetch data handler,
     * see {@link createFetchHandler} for more
     */
    private _meFetchHandler;
    /**
     * Create class instance
     *
     * @param apiKey - Crypto Bot API key, looks like '1234:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
     * @param endpoint - API endpoint url or 'mainnet' or 'testnet'
     *                   for hardcoded in library endpoint urls
     *
     * @throws Error - If passed invalid API key or endpoint
     */
    constructor(apiKey: string, endpoint?: 'mainnet' | 'testnet' | string);
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
    getCurrencies(isForce?: boolean): Promise<Currencies>;
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
    getExchangeRates(isForce?: boolean): Promise<ExchangeRates>;
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
    getMe(isForce?: boolean): Promise<Me>;
}
