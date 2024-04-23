import { Currencies, ExchangeRates } from './casts';
/** Possible backend API methods names */
export declare type ApiMethod = 'getMe' | 'createInvoice' | 'getInvoices' | 'getBalance' | 'getExchangeRates' | 'getCurrencies';
/** Options object type for {@link Client.createInvoice} method */
export declare type CreateInvoiceOptions = {
    /** Invoice currency */
    currency: InvoiceCurrency;
    /** Invoice amount */
    amount: number | string;
    /** Invoice description, displayed to user, up to 1024 symbols */
    description?: string;
    /**
     * Invoice payload, visible only for app, if it not string, JSON.stringify using
     * for preparing to backend API parameters, may be up to 4096 symbols after preparing
     */
    payload?: any;
    /** Url for button which will be shown when invoice was paid */
    paidBtnUrl?: string;
    /** Text for button which will be shown when invoice was paid */
    paidBtnName?: PaidBtnName;
    /** Is can user leave a comment for invoice */
    isAllowComments?: boolean;
    /** Is can user pay invoice anonymously */
    isAllowAnonymous?: boolean;
};
/** Backend options object type for {@link Client.createInvoice} method */
export declare type CreateInvoiceBackendOptions = {
    /** Invoice currency */
    asset: InvoiceCurrency;
    /** Invoice amount */
    amount: number;
    /** Invoice description, displayed to user */
    description?: string;
    /** Invoice payload, visible only for app */
    payload?: string;
    /** Url for button which will be shown when invoice was paid */
    paid_btn_url?: string;
    /** Text for button which will be shown when invoice was paid */
    paid_btn_name?: PaidBtnName;
    /** Is can user leave a comment for invoice */
    allow_comments?: boolean;
    /** Is can user pay invoice anonymously */
    allow_anonymous?: boolean;
};
/** Options object type for {@link Client.getInvoices} method */
export declare type GetInvoicesOptions = {
    /** Invoices currency filter */
    currency?: InvoiceCurrency;
    /** Invoices identifiers filter */
    ids?: (number | string)[];
    /** Invoices status filter */
    status?: InvoiceStatus;
    /** Number of invoices to skip */
    offset?: number;
    /** Number of invoices returned */
    count?: number;
};
/** Options object type for {@link Client.getInvoicesPaginate} method */
export declare type GetInvoicesPaginateOptions = {
    /** Invoices currency filter */
    currency?: InvoiceCurrency;
    /** Invoices identifiers filter */
    ids?: (number | string)[];
    /** Invoices status filter */
    status?: InvoiceStatus;
    /** Pagination page number */
    page?: number;
};
/** Backend options object type for {@link Client.getInvoices} method */
export declare type GetInvoicesBackendOptions = {
    /** Invoices currency filter */
    asset?: InvoiceCurrency;
    /** Invoices identifiers filter */
    invoice_ids?: number[];
    /** Invoices status filter */
    status?: InvoiceStatus;
    /** Number of invoices to skip */
    offset?: number;
    /** Number of invoices returned */
    count?: number;
};
/** Possible invoices currencies */
export declare type InvoiceCurrency = 'BTC' | 'ETH' | 'TON' | 'BNB' | 'BUSD' | 'USDC' | 'USDT';
/**
 * Possible invoices statuses
 * - active - Unpaid invoice
 * - paid - Paid invoice
 */
export declare type InvoiceStatus = 'active' | 'paid';
/**
 * Express.js-like API middleware handler
 */
export declare type Middleware = (req: any, res: any) => void;
/**
 * Paid button types, button text depends on the type
 * - viewItem - View Item
 * - openChannel - Open Channel
 * - openBot - Open Bot
 * - callback - Return
 */
export declare type PaidBtnName = 'viewItem' | 'openChannel' | 'openBot' | 'callback';
/**
 * Return exchange rate to passed currencies pair
 *
 * @param source - Source currency code
 * @param target - Target currency code
 * @param exchangeRates - Exchange rates information from {@link Store.getExchangeRates} method
 * @param currencies - Currencies information from {@link Store.getCurrencies} method
 *
 * @returns Exchange rate or zero, if currencies pair not exists
 */
export declare const getExchageRate: (source: string, target: string, exchangeRates: ExchangeRates, currencies: Currencies) => number;
/**
 * Check is string is valid url
 *
 * @param input - String
 *
 * @returns Check result
 */
export declare const isValidUrl: (input: string) => boolean;
/**
 * Convert nanos string value to the form of string of whole coins
 *
 * @remarks
 * Currencies need to know how many characters after decimal point are used by currency
 *
 * @param value - Value in nanos
 * @param currencyCode - Currency code
 * @param currencies - Currencies information from {@link Store.getCurrencies} method
 *
 * @returns Representation of amount in coins
 */
export declare const nonosToCoins: (value: string, currencyCode: InvoiceCurrency, currencies: Currencies) => string;
/**
 * Convert {@link CreateInvoiceOptions} object to using backend API method
 * parameters {@link CreateInvoiceBackendOptions} object
 *
 * @param options - Library {@link Client.createInvoice} method options object
 *
 * @throws Error - If options object invalid
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareCreateInvoiceOptions: (options: CreateInvoiceOptions) => CreateInvoiceBackendOptions;
/**
 * Convert {@link GetInvoicesOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoices} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetInvoicesOptions: (options: GetInvoicesOptions) => GetInvoicesBackendOptions;
/**
 * Convert {@link GetInvoicesPaginateOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoices} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetInvoicesPaginateOptions: (pageSize: number, options: GetInvoicesPaginateOptions) => GetInvoicesBackendOptions;
