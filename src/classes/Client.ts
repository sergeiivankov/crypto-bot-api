import {
  Balances, Balance, BalancesType, Currency, CurrencyCode, CryptoCurrencyCode, CurrencyType,
  Currencies, DetailedCurrencyType, ExchangeRates, Invoice, Stats,
  InvoiceStatus, toBalances, toInvoice, toInvoices, toStats,
} from '../helpers/casts';
import {
  ApiMethod, CreateInvoiceOptions, GetInvoicesOptions, GetInvoicesPaginateOptions, GetStatsOptions,
  getExchageRate, prepareCreateInvoiceOptions, prepareDeleteOptions, prepareGetInvoicesOptions,
  prepareGetInvoicesPaginateOptions, prepareGetStatsOptions,
} from '../helpers/utils';
import Store from './Store';

// Because `tsdoc` not support `@category` tag, but `typedoc` support
/* eslint-disable tsdoc/syntax */
/**
 * Main class for work with API for browsers
 *
 * Library for browsers default export this class
 *
 * @category External
 */
/* eslint-enable tsdoc/syntax */
export default class Client extends Store {
  /** Page size for {@link Client.getInvoicesPaginate} method */
  private _pageSize: number = 100;

  /**
   * Access to {@link CurrencyType} enumeration, used in {@link Invoice} type
   */
  public static CurrencyType: typeof CurrencyType = CurrencyType;

  /**
 * Access to {@link DetailedCurrencyType} enumeration, used in {@link Store.getCurrencies}
 * and {@link Client.getCurrency} methods results
 */
  public static DetailedCurrencyType: typeof DetailedCurrencyType = DetailedCurrencyType;

  /**
   * Access to {@link InvoiceStatus} enumeration, used in {@link Invoice} type,
   * {@link Client.getInvoices} and {@link Client.getInvoicesPaginate} methods options
   */
  public static InvoiceStatus: typeof InvoiceStatus = InvoiceStatus;

  /**
   * Return count invoices per page for {@link Client.getInvoicesPaginate} method
   */
  getPageSize(): number {
    return this._pageSize;
  }

  /**
   * Set count invoices per page for {@link Client.getInvoicesPaginate} method
   *
   * @param pageSizeParam - Invoices per page
   *
   * @throws Error - If `pageSize` parameter is invalid
   */
  setPageSize(pageSizeParam: number): void {
    const pageSize = +pageSizeParam;
    if (pageSize > 1000 || pageSize < 1) {
      throw Error('Page size may be from 1 to 1000');
    }
    this._pageSize = pageSize;
  }

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
  getStats(options: GetStatsOptions = {}): Promise<Stats> {
    return this._transport.call('getStats', prepareGetStatsOptions(options))
      .then((result: any): Stats => toStats(result));
  }

  /**
   * Get API app balances infomation
   *
   * Use {@link toBalances} backend API result convert function
   *
   * @throws Error - If there is an error sending request to backend API or parsing response
   *
   * @returns Promise, what resolved to API app balances infomation object
   */
  getBalances(): Promise<Balances> {
    return this._transport.call('getBalance').then((result: any): Balances => toBalances(result));
  }

  /**
   * Get API app balances infomation
   *
   * Use {@link toBalances} backend API result convert function
   *
   * @throws Error - If there is an error sending request to backend API or parsing response
   *
   * @returns Promise, what resolved to API app available balances infomation object
   */
  getBalancesAvailable(): Promise<BalancesType> {
    return this.getBalances()
      .then((balances: Balances): BalancesType => {
        return Object.entries(balances).reduce(
          (accumulator: BalancesType, entry: [CryptoCurrencyCode, Balance]): BalancesType => {
            const [code, balance] = entry;
            accumulator[code] = balance.available;
            return accumulator;
          },
          {} as BalancesType,
        );
      });
  }

  /**
   * Get API app balances infomation
   *
   * Use {@link toBalances} backend API result convert function
   *
   * @throws Error - If there is an error sending request to backend API or parsing response
   *
   * @returns Promise, what resolved to API app balances on hold infomation object
   */
  getBalancesOnhold(): Promise<BalancesType> {
    return this.getBalances()
      .then((balances: Balances): BalancesType => {
        return Object.entries(balances).reduce(
          (accumulator: BalancesType, entry: [CryptoCurrencyCode, Balance]): BalancesType => {
            const [code, balance] = entry;
            accumulator[code] = balance.onhold;
            return accumulator;
          },
          {} as BalancesType,
        );
      });
  }

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
  getBalance(currencyCode: CryptoCurrencyCode): Promise<Balance> {
    return this.getBalances()
      .then((balances: Balances): Balance => {
        if (balances[currencyCode] === undefined) return { available: '0', onhold: '0' };
        return balances[currencyCode];
      });
  }

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
  getBalanceAvailable(currencyCode: CryptoCurrencyCode): Promise<string> {
    return this.getBalances()
      .then((balances: Balances): string => {
        if (balances[currencyCode] === undefined) return '0';
        return balances[currencyCode].available;
      });
  }

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
  getBalanceOnhold(currencyCode: CryptoCurrencyCode): Promise<string> {
    return this.getBalances()
      .then((balances: Balances): string => {
        if (balances[currencyCode] === undefined) return '0';
        return balances[currencyCode].onhold;
      });
  }

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
  getCurrency(currencyCode: CurrencyCode, isForce: boolean = false): Promise<Currency | null> {
    return this.getCurrencies(isForce)
      .then((currencies: Currencies): Currency | null => {
        if (currencies[currencyCode] === undefined) return null;
        return currencies[currencyCode];
      });
  }

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
  getExchangeRate(
    source: string, target: string, isForce: boolean = false,
  ): Promise<string> {
    return this.getExchangeRates(isForce)
      .then((exchangeRates: ExchangeRates): string => {
        return getExchageRate(source, target, exchangeRates);
      });
  }

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
  createInvoice(options: CreateInvoiceOptions): Promise<Invoice> {
    return this._transport.call('createInvoice', prepareCreateInvoiceOptions(options))
      .then((result: any): Invoice => toInvoice(result));
  }

  /**
   * Delete invoice
   *
   * @param id - Invoice identifier
   *
   * @throws Error - If there is an error sending request to backend API or parsing response error
   *
   * @returns Promise, what resolved to boolean operation result status
   */
  deleteInvoice(id: number): Promise<boolean> {
    return this._transport.call('deleteInvoice', { invoice_id: prepareDeleteOptions(id) });
  }

  /**
   * Delete check
   *
   * @param id - Check identifier
   *
   * @throws Error - If there is an error sending request to backend API or parsing response error
   *
   * @returns Promise, what resolved to boolean operation result status
   */
  deleteCheck(id: number): Promise<boolean> {
    return this._transport.call('deleteCheck', { check_id: prepareDeleteOptions(id) });
  }

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
  getInvoices(options: GetInvoicesOptions = {}): Promise<Invoice[]> {
    return this._transport.call('getInvoices', prepareGetInvoicesOptions(options))
      .then((result: any): Invoice[] => toInvoices(result));
  }

  /**
   * Get invoices paginated
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
  getInvoicesPaginate(options: GetInvoicesPaginateOptions = {}): Promise<Invoice[]> {
    const prepared = prepareGetInvoicesPaginateOptions(this._pageSize, options);

    return this._transport.call('getInvoices', prepared)
      .then((result: any): Invoice[] => toInvoices(result));
  }

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
  call(method: string, options: object = {}): Promise<any> {
    return this._transport.call(method as ApiMethod, options);
  }
}
