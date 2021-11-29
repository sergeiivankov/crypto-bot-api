import { Balances, Currency, Invoice, Invoices, InvoicesPaginated } from '../helpers/casts';
import { CreateInvoiceOptions, GetInvoicesOptions, GetInvoicesPaginateOptions, GetPaymentsOptions } from '../helpers/utils';
import Store from './Store';
/**
 * Main class for work with API
 *
 * Library default export this class
 *
 * @category External
 */
export default class Client extends Store {
    /** Page size for {@link Client.getInvoicesPaginate} method */
    private _pageSize;
    /**
     * Return count invoices per page for {@link Client.getInvoicesPaginate} method
     */
    getPageSize(): number;
    /**
     * Set count invoices per page for {@link Client.getInvoicesPaginate} method
     *
     * @param pageSize - Invoices per page
     *
     * @throws Error - If `pageSize` parameter is invalid
     */
    setPageSize(pageSizeParam: number): void;
    /**
     * Get API app balances infomation
     *
     * Use {@link toBalances} backend API result convert function
     *
     * Call {@link Store.getCurrencies} method to fetch exchange rates information
     *
     * @param isReturnInNanos - If true, return raw balances in nanos,
     *                          else return converted to coins balances
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balances infomation object
     */
    getBalances(isReturnInNanos?: boolean, isForce?: boolean): Promise<Balances>;
    /**
     * Get API app balance value for passed currency
     *
     * Call {@link Client.getBalances} method to fetch balances information
     *
     * @param currencyCode - Currency code
     * @param isReturnInNanos - If true, return raw balances in nanos,
     *                          else return converted to coins balances
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balance value for passed currency
     */
    getBalance(currencyCode: string, isReturnInNanos?: boolean, isForce?: boolean): Promise<string>;
    /**
     * Get currency with passed code infomation
     *
     * Call {@link Store.getCurrencies} method to fetch currencies information
     *
     * @param currencyCode - Currency code
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to currency with passed code infomation object
     *          or null, if currency with passed code not exists
     */
    getCurrency(currencyCode: string, isForce?: boolean): Promise<Currency | null>;
    /**
     * Get one exchange rate infomation to passed currencies pair
     *
     * Call {@link Store.getExchangeRates} method to fetch exchange rates information,
     * {@link Store.getCurrencies} method to fetch currencies information
     * and use {@link getExchageRate} function to get signle exchange rate
     *
     * @param source - Source currency code
     * @param target - Target currency code
     * @param isForce - If true, return fresh data from backend API, not from cache
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to exchange rate or zero, if currencies pair not exists
     */
    getExchangeRate(source: string, target: string, isForce?: boolean): Promise<number>;
    /**
     * Create invoice
     *
     * Use {@link toInvoice} backend API result convert function and
     * prepare backend API parameters {@link prepareCreateInvoiceOptions} function
     *
     * @param options - New invoice options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to created invoice information object
     */
    createInvoice(options: CreateInvoiceOptions): Promise<Invoice>;
    /**
     * Confirm paid invoice
     *
     * Use {@link toInvoice} backend API result convert function
     *
     * @param id - Invoice identifier
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to confirmed invoice information object
     */
    confirmPayment(id: number | string): Promise<Invoice>;
    /**
     * Get unconfirmed (include unpaid and paid) invoices
     *
     * Use {@link toInvoices} backend API result convert function and
     * prepare backend API parameters {@link prepareGetInvoicesOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to invoices information object
     */
    getInvoices(options?: GetInvoicesOptions): Promise<Invoices>;
    /**
     * Get unconfirmed only paid invoices
     *
     * Use {@link toInvoices} backend API result convert function
     *
     * @remarks
     * This method not need prepare backend API parameters convert function,
     * because in library method used same parameters names like backend API method
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to invoices information object
     */
    getPayments(options?: GetPaymentsOptions): Promise<Invoices>;
    /**
     * Get unconfirmed (include unpaid and paid) invoices paginated
     *
     * Fetch invoices with `page` options parameter, except `count` and `offset`
     *
     * See {@link Client.getPageSize} and {@link Client.setPageSize}
     *
     * Use {@link toInvoicesPaginated} backend API result convert function and
     * prepare backend API parameters {@link prepareGetInvoicesPaginateOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to invoices information object
     */
    getInvoicesPaginate(options?: GetInvoicesPaginateOptions): Promise<InvoicesPaginated>;
}
