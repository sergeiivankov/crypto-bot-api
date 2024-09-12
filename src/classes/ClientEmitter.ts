import { createHash, createHmac } from 'crypto';
import { ListenOptions } from 'net';
import { IncomingMessage, RequestListener, ServerResponse } from 'http';
import { Server, ServerOptions, createServer } from 'https';
import Client from './Client';
import { Invoice, toInvoice } from '../helpers/casts';
import { Middleware } from '../helpers/utils';

/**
 * Check webhook data signature
 *
 * @param apiKey - Api key
 * @param signature - Webhook request signature
 * @param body - Webhook request body
 *
 * @returns Checking result
 */
export const checkSignature = (apiKey: string, signature: string, body: any): boolean => {
  try {
    const secret = createHash('sha256').update(apiKey).digest();
    const checkString = JSON.stringify(body);
    const hmac = createHmac('sha256', secret).update(checkString).digest('hex');
    return hmac === signature;
  } catch {
    return false;
  }
};

/**
 * Read and parsing to JSON request body
 *
 * @param req - Node.js built-in IncomingMessage object
 *
 * @returns Promise, what resolved to parsed body or `null` for parsing error
 */
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
    } catch {
      resolve(null);
      return;
    }

    resolve(data);
  });
});

// Because `tsdoc` not support `@category` tag, but `typedoc` support
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

  /** Handling webhooks created Node.js built-in server */
  private _server: Server;

  /** Event listeners store */
  private _events: { [key: string]: Array<(...args: any) => any> } = {};

  // Because `tsdoc` throw `tsdoc-reference-selector-missing-parens`,
  // but `typedoc` doesn't recognize reference in parentheses
  /* eslint-disable tsdoc/syntax */
  /** {@inheritDoc Client:constructor} */
  /* eslint-enable tsdoc/syntax */
  constructor(apiKey: string, endpoint: string = 'mainnet') {
    super(apiKey, endpoint);
    this._apiKey = apiKey;
  }

  /**
   * Create handling webhooks server
   *
   * Important: at the time of publication of version 0.2.0 (Dec 9, 2021),
   * API servers do not accept self-signed certificates
   *
   * @param serverOptions - Node.js built-in server options
   * @param secretPath - Webhooks secret path, processing webhooks takes place only on it
   * @param listenOptions - Node.js built-in server listen options
   *
   * @throws Error - If create server error
   *
   * @returns Promise, what resolved `void`
   */
  createServer(
    serverOptions: ServerOptions, secretPath: string = '/',
    listenOptions: ListenOptions = { port: 443 },
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const requestListener: RequestListener = (req: IncomingMessage, res: ServerResponse) => {
        if (req.url !== secretPath) {
          res.statusCode = 404;
          res.end();
          return;
        }

        readRequestBody(req).then((data: any): void => this._handleWebhook(data, req, res));
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

  /**
   * Close created handling webhooks server
   *
   * @throws Error - If server not was started or closing error
   *
   * @returns Promise, what resolved `void`
   */
  closeServer(): Promise<void> {
    if (!this._server) return Promise.reject(new Error('Server not started'));

    return new Promise((resolve, reject) => {
      this._server.close((err?: Error): void => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Create middleware function for Express.js-like API
   *
   * @returns Middleware function
   */
  middleware(): Middleware {
    return (req: any, res: any): void => {
      Promise.resolve()
        .then((): any => req.body || readRequestBody(req))
        .then((data: any): void => this._handleWebhook(data, req, res));
    };
  }

  /**
   * Subscribes to `paid` event
   *
   * See {@link ClientEmitter._emit} to more about event listener
   *
   * @param event - `paid` event name
   * @param listener - Event listener with `invoice` and `requestDate` callback parameters
   */
  on(event: 'paid', listener: (invoice?: Invoice, requestDate?: Date) => any): void;

  /**
   * Subscribes to event
   *
   * @param event - Event name
   * @param listener - Event listener
   */
  on(event: string, listener: (...args: any) => any): void {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(listener);
  }

  /**
   * Unsubscribes from `paid` event
   *
   * @param event - `paid` event name
   * @param listener - Event listener with `invoice` and `requestDate` callback parameters
   */
  off(event: 'paid', listener: (invoice?: Invoice, requestDate?: Date) => any): void;

  /**
   * Unsubscribes from event
   *
   * @param event - Event name
   * @param listener - Event listener
   */
  off(event: string, listener: (...args: any) => any): void {
    if (!this._events[event]) return;

    const idx = this._events[event].indexOf(listener);
    if (idx > -1) this._events[event].splice(idx, 1);
  }

  /**
   * Emit event to listeners
   *
   * @param event - `paid` event name
   * @param invoice - Paid invoice information object
   * @param requestDate - Date of occurrence of event, need to filter old event.
   *                      If server is not available, backend API try resend webhooks by timeout,
   *                      so when server becomes  available again, many old events
   *                      will be sent from backend API.
   */
  private _emit(event: 'paid', invoice: Invoice, requestDate: Date): void;

  /**
   * Emit event to listeners
   *
   * @param event - Event name
   * @param params - Call event listeners parameters
   */
  private _emit(event: string, ...params: any): void {
    if (!this._events[event]) return;

    this._events[event].forEach((listener: (...args: any) => any): void => {
      listener(...params);
    });
  }

  /**
   * Handling webhook data, send response and emit events
   *
   * @param data - Parsed request body
   * @param req - Node.js built-in IncomingMessage object
   * @param res - Node.js built-in ServerResponse object
   */
  private _handleWebhook(data: any, req: IncomingMessage, res: ServerResponse): void {
    if (!data) {
      res.statusCode = 500;
      res.end();
      return;
    }

    const header = req.headers['crypto-pay-api-signature'];
    const signature = Array.isArray(header) ? header[0] : header;

    if (!checkSignature(this._apiKey, signature, data)) {
      res.statusCode = 401;
      res.end();
      return;
    }

    if (data.update_type === 'invoice_paid') {
      this._emit(
        'paid', toInvoice(data.payload), new Date(data.request_date),
      );
    }

    res.end();
  }
}

export default ClientEmitter;
