import { IncomingMessage } from 'http';
import { request as httpsRequest } from 'https';

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
const request = (url: string): Promise<string> => new Promise((resolve, reject) => {
  const req = httpsRequest(url, {}, (res: IncomingMessage): void => {
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
