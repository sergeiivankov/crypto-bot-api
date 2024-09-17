import { ListenOptions } from 'net';
import { IncomingMessage } from 'http';
import { ServerOptions } from 'https';
import Client from './Client';
import { Invoice } from '../helpers/casts';
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
export declare const checkSignature: (apiKey: string, signature: string, body: any) => boolean;
/**
 * Read and parsing to JSON request body
 *
 * @param req - Node.js built-in IncomingMessage object
 *
 * @returns Promise, what resolved to parsed body or `null` for parsing error
 */
export declare const readRequestBody: (req: IncomingMessage) => Promise<any>;
/**
 * Main class for work with API for Node.js
 *
 * Library for Node.js default export this class
 *
 * @category External
 */
declare class ClientEmitter extends Client {
    /** Api key */
    private _apiKey;
    /** Handling webhooks created Node.js built-in server */
    private _server;
    /** Event listeners store */
    private _events;
    /** {@inheritDoc Client:constructor} */
    constructor(apiKey: string, endpoint?: string);
    /**
     * Create handling webhooks server
     *
     * If you app work behind proxy and no need create HTTPS server,
     * no pass `key` and `cert` fields and add `http` field with `true` value: `{ http: true }`
     *
     * Note: if you want to use self-signed certificate
     * you must uploat it in CryptoBot API application settings
     *
     * @param serverOptions - Node.js built-in server options
     * @param secretPath - Webhooks secret path, processing webhooks takes place only on it
     * @param listenOptions - Node.js built-in server listen options
     *
     * @throws Error - If create server error
     *
     * @returns Promise, what resolved `void`
     */
    createServer(serverOptions: ServerOptions & {
        http: boolean;
    }, secretPath?: string, listenOptions?: ListenOptions): Promise<void>;
    /**
     * Close created handling webhooks server
     *
     * @throws Error - If server not was started or closing error
     *
     * @returns Promise, what resolved `void`
     */
    closeServer(): Promise<void>;
    /**
     * Create middleware function for Express.js-like API
     *
     * @returns Middleware function
     */
    middleware(): Middleware;
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
     * Unsubscribes from `paid` event
     *
     * @param event - `paid` event name
     * @param listener - Event listener with `invoice` and `requestDate` callback parameters
     */
    off(event: 'paid', listener: (invoice?: Invoice, requestDate?: Date) => any): void;
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
    private _emit;
    /**
     * Handling webhook data, send response and emit events
     *
     * @param data - Parsed request body
     * @param req - Node.js built-in IncomingMessage object
     * @param res - Node.js built-in ServerResponse object
     */
    private _handleWebhook;
}
export default ClientEmitter;
