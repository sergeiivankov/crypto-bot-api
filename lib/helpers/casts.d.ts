import { InvoiceCurrency, InvoiceStatus, PaidBtnName } from './utils';
/** Result type for {@link Client.getBalances} method */
export declare type Balances = {
    [key: string]: string;
};
/** Possible currencies types */
export declare type CurrencyType = 'blockchain' | 'fiat' | 'stablecoin';
/**
 * Currency type object for {@link Store.getCurrencies}
 * and {@link Client.getCurrency} methods results
 */
export declare type Currency = {
    /** Currency name */
    name: string;
    /** Crypto currency office website url */
    url?: string;
    /** Currency decimals count */
    decimals: number;
    /** Currency type */
    type: CurrencyType;
};
/** Result type for {@link Store.getCurrencies} method */
export declare type Currencies = {
    [key: string]: Currency;
};
/**
 * Exchange rate type object for {@link Store.getExchangeRates}
 * and {@link Client.getExchangeRate} methods results
 *
 * @remarks
 * Used strings for currencies codes instead of {@link InvoiceCurrency},
 * because exchange rates contains fiat currencies, who do not take part in other methods
 */
export declare type ExchangeRate = {
    /** Source currency code */
    source: string;
    /** Target currency code */
    target: string;
    /** Source to target exchange rate */
    rate: number;
};
/** Result type for {@link Store.getExchangeRates} method */
export declare type ExchangeRates = ExchangeRate[];
/**
 * Invoice type object for {@link Client.getInvoices}, {@link Client.getPayments},
 * {@link Client.getInvoicesPaginate}, {@link Client.createInvoice}
 * and {@link Client.confirmPayment} methods results
 */
export declare type Invoice = {
    /** Invoice identifier */
    id: number;
    /** Invoice status */
    status: InvoiceStatus;
    /** Invoice hash */
    hash: string;
    /** Invoice currency code */
    currency: InvoiceCurrency;
    /** Invoice amount */
    amount: number;
    /** Invoice pay url for user */
    payUrl: string;
    /** Is invoice allow user comment */
    isAllowComments: boolean;
    /** Is user can pay invoice anonymously */
    isAllowAnonymous: boolean;
    /** Invoice created date */
    createdAt: Date;
    /** Is invoice confirmed by app */
    isConfirmed: boolean;
    /** Is invoice paid anonymously, only for paid invoice */
    isPaidAnonymously?: boolean;
    /** Invoice paid date, only for paid invoice */
    paidAt?: Date;
    /** Invoice displayed to user description, only if `description` passed in invoice creation */
    description?: string;
    /** Invoice visible only to app payload, only if `payload` passed in invoice creation */
    payload?: string;
    /**
     * Invoice left user comment, only if set `isAllowComments` to true in invoice creation
     * and user left comment
     */
    comment?: string;
    /**
     * Invoice displayed to user paid button name,
     * only if `paidBtnName` passed in invoice creation
     */
    paidBtnName?: PaidBtnName;
    /**
     * Invoice displayed to user paid button url,
     * only if `paidBtnUrl` passed in invoice creation
     */
    paidBtnUrl?: string;
    /** Invoice confirmed date, only for {@link Client.confirmPayment} method result */
    confirmedAt?: Date;
};
/**
 * Invoices type object for {@link Client.getInvoices}, {@link Client.getPayments}
 * and {@link Client.getInvoicesPaginate} methods results
 */
export declare type Invoices = {
    /** All items count value */
    count: number;
    /** Fetched by passed filters items slice */
    items: Invoice[];
};
/**
 * Invoices type object for {@link Client.getInvoicesPaginate} methods results
 */
export declare type InvoicesPaginated = {
    /** Pagination page number */
    page: number;
    /** Pagination pages count */
    pagesCount: number;
    /** Fetched by passed filters items slice */
    items: Invoice[];
};
/** Result type object for {@link Client.getMe} method */
export declare type Me = {
    /** App identifier */
    id: number;
    /** App name */
    name: string;
    /** Using Telegram bot username */
    bot: string;
};
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getBalances} method
 *
 * @param input - Backend API result
 * @param currencies - Currencies information from {@link Store.getCurrencies} method,
 *                     need to correct format output in coins by currencies decimals counts
 * @param isReturnInNanos - If true, return raw balances in nanos,
 *                          else return converted to coins balances
 *
 * @returns Converted result
 */
export declare const toBalances: (input: any, currencies: Currencies, isReturnInNanos: boolean) => Balances;
/**
 * Convert backend API result to library result object to return in
 * {@link Store.getCurrencies} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toCurrencies: (input: any) => Currencies;
/**
 * Convert backend API result to library result object to return in
 * {@link Store.getExchangeRates} method result
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toExchangeRates: (input: any) => ExchangeRates;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.createInvoice}, {@link Client.confirmPayment} methods
 * and {@link toInvoices} function
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toInvoice: (input: any) => Invoice;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getInvoices}, {@link Client.getPayments} and {@link Client.getInvoicesPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toInvoices: (input: any) => Invoices;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getInvoicesPaginate} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toInvoicesPaginated: (page: number, pageSize: number, input: any) => InvoicesPaginated;
/**
 * Convert backend API result to library result object to return in
 * {@link Store.getMe} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toMe: (input: any) => Me;
