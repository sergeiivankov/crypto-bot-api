/**
 * Make HTTP GET request
 *
 * Module imported for Node.js library building
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
