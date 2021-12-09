import { ApiMethod } from '../helpers/utils';
/**
 * Make backend API calls
 */
export default class Transport {
    /** RegExp to check API key */
    static KEY_CHECK_REGEXP: RegExp;
    /** Api key */
    private _apiKey;
    /** Backend API endpoint base url */
    private _baseUrl;
    /**
     * Create class instance
     *
     * @param apiKey - Crypto Bot API key, looks like '1234:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
     * @param endpoint - API endpoint url or 'mainnet' or 'testnet'
     *                   for hardcoded in library endpoint urls
     *
     * @throws Error - If passed invalid API key or endpoint
     */
    constructor(apiKey: string, endpoint: 'mainnet' | 'testnet' | string);
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
    call(method: ApiMethod, parameters?: object): Promise<any>;
}
