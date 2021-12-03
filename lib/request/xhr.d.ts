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
declare const request: (url: string, apiKey: string) => Promise<string>;
export default request;
