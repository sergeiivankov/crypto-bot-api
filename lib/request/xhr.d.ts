/**
 * Make HTTP GET request
 *
 * Module imported only for browsers bundle
 *
 * @param url - Url
 *
 * @throws Error - If request fail
 *
 * @returns Raw response text
 */
declare const request: (url: string) => Promise<string>;
export default request;
