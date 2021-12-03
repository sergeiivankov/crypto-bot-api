import { createHash, createHmac } from 'crypto';
import { ListenOptions } from 'net';
import { IncomingMessage, RequestListener, ServerResponse } from 'http';
import { Server, ServerOptions, createServer } from 'https';
import Client from './Client';
import { Invoice, toInvoice } from '../helpers/casts';

export const checkSignature = (
  token: string, { signature, ...data }: { signature: string, data: any[] },
): boolean => {
  const secret = createHash('sha256').update(token).digest();
  const checkString = Object.keys(data).sort().map((k) => `${k}=${data[k]}`).join('\n');

  return signature === createHmac('sha256', secret).update(checkString).digest('hex');
};

export const readRequestBody = (
  req: IncomingMessage,
): Promise<any> => new Promise((resolve): void => {
  let body: string = '';

  req.on('data', (chunk: string): void => {
    body += chunk;
  });

  req.on('end', () => {
    let data: any;
    try {
      data = JSON.parse(body);
    } catch (err) {
      resolve(null);
      return;
    }

    resolve(data);
  });
});

/* eslint-disable tsdoc/syntax */
/**
 * Main class for work with API for Node.js
 *
 * Library for Node.js default export this class
 *
 * @category External
 */
/* eslint-enable tsdoc/syntax */
class ClientEmitter extends Client {
  /** Api key */
  private _apiKey: string;

  private _server: Server;

  private _events: { [key: string]: Array<(...args: any) => any> } = {};

  /* eslint-disable tsdoc/syntax */
  /** @inheritdoc */
  /* eslint-enable tsdoc/syntax */
  constructor(apiKey: string, endpoint: string = 'mainnet') {
    super(apiKey, endpoint);
    this._apiKey = apiKey;
  }

  createServer(
    serverOptions: ServerOptions, listenOptions: ListenOptions = { port: 443 },
    secretPath: string = '/',
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const requestListener: RequestListener = (req: IncomingMessage, res: ServerResponse) => {
        if (req.url !== secretPath) {
          res.statusCode = 404;
          res.end();
          return;
        }

        readRequestBody(req).then((data: any): void => this._handleWebhook(data, res));
      };

      let server: Server;
      try {
        server = createServer(serverOptions, requestListener);
      } catch (err) {
        reject(err);
        return;
      }

      server.on('error', reject);

      try {
        server.listen(listenOptions, (): void => {
          this._server = server;
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  closeServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._server.close((err?: Error): void => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  middleware(): (req: any, res: any) => void {
    return (req: any, res: any): void => {
      Promise.resolve()
        .then((): any => req.body || readRequestBody(req))
        .then((data: any): void => this._handleWebhook(data, res));
    };
  }

  on(event: 'paid', listener: (invoice?: Invoice, requestDate?: Date) => any): void;

  on(event: string, listener: (...args: any) => any): void {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(listener);
  }

  off(event: 'paid', listener: (invoice?: Invoice, requestDate?: Date) => any): void;

  off(event: string, listener: (...args: any) => any): void {
    if (!this._events[event]) return;

    const idx = this._events[event].indexOf(listener);
    if (idx > -1) this._events[event].splice(idx, 1);
  }

  private _emit(event: 'paid', invoice: Invoice, requestDate: Date): void;

  private _emit(event: string, ...params: any): void {
    if (!this._events[event]) return;

    this._events[event].forEach((listener: (...args: any) => any): void => {
      listener(...params);
    });
  }

  private _handleWebhook(data: any, res: ServerResponse): void {
    if (!data) {
      res.statusCode = 500;
      res.end();
      return;
    }

    if (!checkSignature(this._apiKey, data.invoice_paid)) {
      res.statusCode = 401;
      res.end();
      return;
    }

    this._emit(
      'paid', toInvoice(data.invoice_paid), new Date(data.invoice_paid.request_date * 1000),
    );
    res.end();
  }
}

export default ClientEmitter;
