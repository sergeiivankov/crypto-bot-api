import { IncomingMessage } from 'http';
import { request as httpsRequest, RequestOptions } from 'https';

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
const request = (url: string, apiKey: string): Promise<string> => new Promise((resolve, reject) => {
  const options: RequestOptions = {
    headers: { 'Crypto-Pay-API-Token': apiKey },
  };

  const req = httpsRequest(url, options, (res: IncomingMessage): void => {
    let data = '';

    res.on('error', reject);

    res.on('data', (chunk: string): void => {
      data += chunk;
    });

    res.on('end', (): void => {
      resolve(data);
    });
  });

  req.on('error', reject);

  req.end();
});

export default request;
