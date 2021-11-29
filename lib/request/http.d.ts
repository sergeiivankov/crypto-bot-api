/**
 * Make HTTP GET request
 *
 * Module imported for Node.js library building
 *
 * @param url - Url
 *
 * @throws Error - If request fail
 *
 * @returns Raw response text
 */
declare const request: (url: string) => Promise<string>;
export default request;
