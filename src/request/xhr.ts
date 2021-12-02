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
const request = (url: string, apiKey: string): Promise<string> => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Crypto-Pay-API-Token', apiKey);

  xhr.onreadystatechange = (): void => {
    if (xhr.readyState !== 4) return;
    resolve(xhr.responseText);
  };

  xhr.onerror = (): void => {
    reject(new Error('Network Error'));
  };

  xhr.send();
});

export default request;
