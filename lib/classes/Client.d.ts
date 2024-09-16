import { Balances, Balance, BalancesType, Currency, CurrencyCode, CryptoCurrencyCode, CurrencyType, DetailedCurrencyType, Invoice, Check, Stats, Transfer, InvoiceStatus, CheckStatus, TransferStatus } from '../helpers/casts';
import { CreateInvoiceOptions, CreateCheckOptions, GetChecksOptions, GetChecksPaginateOptions, GetInvoicesOptions, GetInvoicesPaginateOptions, GetStatsOptions, TransferOptions, GetTransfersOptions, GetTransfersPaginateOptions } from '../helpers/utils';
import Store from './Store';
/**
 * Main class for work with API for browsers
 *
 * Library for browsers default export this class
 *
 * @category External
 */
export default class Client extends Store {
    /** Page size for {@link Client.getInvoicesPaginate} method */
    private _pageSize;
    /**
     * Access to {@link CurrencyType} enumeration, used in {@link Invoice} type
     */
    static CurrencyType: typeof CurrencyType;
    /**
   * Access to {@link DetailedCurrencyType} enumeration, used in {@link Store.getCurrencies}
   * and {@link Client.getCurrency} methods results
   */
    static DetailedCurrencyType: typeof DetailedCurrencyType;
    /**
     * Access to {@link InvoiceStatus} enumeration, used in {@link Invoice} type,
     * {@link Client.getInvoices} and {@link Client.getInvoicesPaginate} methods options
     */
    static InvoiceStatus: typeof InvoiceStatus;
    /**
     * Access to {@link CheckStatus} enumeration, used in {@link Check} type,
     * {@link Client.getChecks} and {@link Client.getChecksPaginate} methods options
     */
    static CheckStatus: typeof CheckStatus;
    /**
     * Access to {@link TransferStatus} enumeration, used in {@link Transfer} type,
     * {@link Client.getTransfers} and {@link Client.getTransfersPaginate} methods options
     */
    static TransferStatus: typeof TransferStatus;
    /**
     * Return count invoices per page for {@link Client.getInvoicesPaginate} method
     */
    getPageSize(): number;
    /**
     * Set count invoices per page for {@link Client.getInvoicesPaginate} method
     *
     * @param pageSizeParam - Invoices per page
     *
     * @throws Error - If `pageSize` parameter is invalid
     */
    setPageSize(pageSizeParam: number): void;
    /**
     * Get associated with passed API key app statistics
     *
     * Use {@link toStats} backend API result convert function
     *
     * @param options - New receive statistics options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to associated with passed API key app statistics object
     */
    getStats(options?: GetStatsOptions): Promise<Stats>;
    /**
     * Get API app balances infomation
     *
     * Use {@link toBalances} backend API result convert function
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balances infomation object
     */
    getBalances(): Promise<Balances>;
    /**
     * Get API app balances infomation
     *
     * Use {@link toBalances} backend API result convert function
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app available balances infomation object
     */
    getBalancesAvailable(): Promise<BalancesType>;
    /**
     * Get API app balances infomation
     *
     * Use {@link toBalances} backend API result convert function
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balances on hold infomation object
     */
    getBalancesOnhold(): Promise<BalancesType>;
    /**
     * Get API app balance value for passed currency
     *
     * Call {@link Client.getBalances} method to fetch balances information
     *
     * @param currencyCode - Crypto currency code
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balance value for passed currency
     */
    getBalance(currencyCode: CryptoCurrencyCode): Promise<Balance>;
    /**
     * Get API app balance value for passed currency
     *
     * Call {@link Client.getBalances} method to fetch balances information
     *
     * @param currencyCode - Crypto currency code
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app available balance value for passed currency
     */
    getBalanceAvailable(currencyCode: CryptoCurrencyCode): Promise<string>;
    /**
     * Get API app balance value for passed currency
     *
     * Call {@link Client.getBalances} method to fetch balances information
     *
     * @param currencyCode - Crypto currency code
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to API app balance on hold value for passed currency
     */
    getBalanceOnhold(currencyCode: CryptoCurrencyCode): Promise<string>;
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
    getCurrency(currencyCode: CurrencyCode, isForce?: boolean): Promise<Currency | null>;
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
    getExchangeRate(source: string, target: string, isForce?: boolean): Promise<string>;
    /**
     * Transfer
     *
     * Use {@link toTransfer} backend API result convert function and
     * prepare backend API parameters {@link prepareTransferOptions} function
     *
     * @param options - Transfer options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to completed transfer information object
     */
    transfer(options: TransferOptions): Promise<Transfer>;
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
     * Create check
     *
     * Use {@link toCheck} backend API result convert function and
     * prepare backend API parameters {@link prepareCreateCheckOptions} function
     *
     * @param options - New check options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to created check information object
     */
    createCheck(options: CreateCheckOptions): Promise<Check>;
    /**
     * Delete invoice
     *
     * @param id - Invoice identifier
     *
     * @throws Error - If there is an error sending request to backend API or parsing response error
     *
     * @returns Promise, what resolved to boolean operation result status
     */
    deleteInvoice(id: number): Promise<boolean>;
    /**
     * Delete check
     *
     * @param id - Check identifier
     *
     * @throws Error - If there is an error sending request to backend API or parsing response error
     *
     * @returns Promise, what resolved to boolean operation result status
     */
    deleteCheck(id: number): Promise<boolean>;
    /**
     * Get invoices
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
    getInvoices(options?: GetInvoicesOptions): Promise<Invoice[]>;
    /**
     * Get invoices paginated
     *
     * Fetch invoices with `page` options parameter, except `count` and `offset`
     *
     * See {@link Client.getPageSize} and {@link Client.setPageSize}
     *
     * Use {@link toInvoices} backend API result convert function and
     * prepare backend API parameters {@link prepareGetInvoicesPaginateOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to invoices information object
     */
    getInvoicesPaginate(options?: GetInvoicesPaginateOptions): Promise<Invoice[]>;
    /**
     * Get checks
     *
     * Use {@link toChecks} backend API result convert function and
     * prepare backend API parameters {@link prepareGetChecksOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to checks information object
     */
    getChecks(options?: GetChecksOptions): Promise<Check[]>;
    /**
     * Get checks paginated
     *
     * Fetch checks with `page` options parameter, except `count` and `offset`
     *
     * See {@link Client.getPageSize} and {@link Client.setPageSize}
     *
     * Use {@link toChecks} backend API result convert function and
     * prepare backend API parameters {@link prepareGetChecksPaginateOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to checks information object
     */
    getChecksPaginate(options?: GetChecksPaginateOptions): Promise<Check[]>;
    /**
     * Get transfers
     *
     * Use {@link toTransfers} backend API result convert function and
     * prepare backend API parameters {@link prepareGetTransfersOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to transfers information object
     */
    getTransfers(options?: GetTransfersOptions): Promise<Transfer[]>;
    /**
     * Get transfers paginated
     *
     * Fetch checks with `page` options parameter, except `count` and `offset`
     *
     * See {@link Client.getPageSize} and {@link Client.setPageSize}
     *
     * Use {@link toTransfers} backend API result convert function and
     * prepare backend API parameters {@link prepareGetTransfersOptions} function
     *
     * @param options - Filters options
     *
     * @throws Error - If there is an error sending request to backend API, parsing response error
     *                 or options object is invalid
     *
     * @returns Promise, what resolved to transfers information object
     */
    getTransfersPaginate(options?: GetTransfersPaginateOptions): Promise<Transfer[]>;
    /**
     * Call backend API method directly (types unsafe)
     *
     * Use it if backend API update (add new methods, change request or response fileds),
     * but library is not
     *
     * @param method - Backend API method name
     * @param options - Backend API options object
     *
     * @throws Error - If there is an error sending request to backend API or parsing response
     *
     * @returns Promise, what resolved to backend API response `result` field value
     */
    call(method: string, options?: object): Promise<any>;
}
