import { Currencies, InvoiceStatus, ExchangeRates } from './casts';

/** Possible backend API methods names */
export type ApiMethod =
  'getMe' | 'createInvoice' | 'getInvoices' | 'getBalance' | 'getExchangeRates' | 'getCurrencies';

/** Options object type for {@link Client.createInvoice} method */
export type CreateInvoiceOptions = {
  /** Invoice currency */
  currency: InvoiceCurrency,
  /** Invoice amount */
  amount: number | string,
  /** Invoice description, displayed to user, up to 1024 symbols */
  description?: string,
  /**
   * Invoice payload, visible only for app, if it not string, JSON.stringify using
   * for preparing to backend API parameters, may be up to 4096 symbols after preparing
   */
  payload?: any,
  /** Url for button which will be shown when invoice was paid */
  paidBtnUrl?: string,
  /** Text for button which will be shown when invoice was paid */
  paidBtnName?: PaidBtnName,
  /** Is can user leave a comment for invoice */
  isAllowComments?: boolean,
  /** Is can user pay invoice anonymously */
  isAllowAnonymous?: boolean,
};

/** Backend options object type for {@link Client.createInvoice} method */
export type CreateInvoiceBackendOptions = {
  /** Invoice currency */
  asset: InvoiceCurrency,
  /** Invoice amount */
  amount: number,
  /** Invoice description, displayed to user */
  description?: string,
  /** Invoice payload, visible only for app */
  payload?: string,
  /** Url for button which will be shown when invoice was paid */
  paid_btn_url?: string,
  /** Text for button which will be shown when invoice was paid */
  paid_btn_name?: PaidBtnName,
  /** Is can user leave a comment for invoice */
  allow_comments?: boolean,
  /** Is can user pay invoice anonymously */
  allow_anonymous?: boolean,
};

/** Options object type for {@link Client.getInvoices} method */
export type GetInvoicesOptions = {
  /** Invoices currency filter */
  currency?: InvoiceCurrency,
  /** Invoices identifiers filter */
  ids?: (number | string)[],
  /** Invoices status filter */
  status?: GetInvoicesStatus,
  /** Number of invoices to skip */
  offset?: number,
  /** Number of invoices returned */
  count?: number,
};

/** Options object type for {@link Client.getInvoicesPaginate} method */
export type GetInvoicesPaginateOptions = {
  /** Invoices currency filter */
  currency?: InvoiceCurrency,
  /** Invoices identifiers filter */
  ids?: (number | string)[],
  /** Invoices status filter */
  status?: GetInvoicesStatus,
  /** Pagination page number */
  page?: number,
};

/** Backend options object type for {@link Client.getInvoices} method */
export type GetInvoicesBackendOptions = {
  /** Invoices currency filter */
  asset?: InvoiceCurrency,
  /** Invoices identifiers filter */
  invoice_ids?: number[],
  /** Invoices status filter */
  status?: GetInvoicesStatus,
  /** Number of invoices to skip */
  offset?: number,
  /** Number of invoices returned */
  count?: number,
};

/** Possible invoices currencies */
export type InvoiceCurrency = 'BTC' | 'ETH' | 'TON' | 'BNB' | 'BUSD' | 'USDC' | 'USDT';

/**
 * Possible invoices statuses
 * - {@link InvoiceStatus.Active} - Unpaid invoice
 * - {@link InvoiceStatus.Paid} - Paid invoice
 */
export type GetInvoicesStatus = InvoiceStatus.Active | InvoiceStatus.Paid;

/**
 * Express.js-like API middleware handler
 */
export type Middleware = (req: any, res: any) => void;

/**
 * Paid button types, button text depends on the type
 * - viewItem - View Item
 * - openChannel - Open Channel
 * - openBot - Open Bot
 * - callback - Return
 */
export type PaidBtnName = 'viewItem' | 'openChannel' | 'openBot' | 'callback';

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
export const getExchageRate = (
  source: string, target: string, exchangeRates: ExchangeRates, currencies: Currencies,
): number => {
  let rate: number = NaN;
  for (let i = 0, l = exchangeRates.length; i < l; i += 1) {
    const exchangeRate = exchangeRates[i];

    // If source and target correspond to direction in Store.getExchangeRates method result
    if (exchangeRate.source === source && exchangeRate.target === target) {
      rate = exchangeRate.rate;
      break;
    }

    // If source and target reverse to direction in Store.getExchangeRates method result
    if (exchangeRate.source === target && exchangeRate.target === source) {
      rate = 1 / exchangeRate.rate;
      break;
    }
  }

  if (isNaN(rate)) return 0;

  const numberOfNanosSigns = currencies[target]?.decimals || 8;
  return parseFloat(rate.toFixed(numberOfNanosSigns));
};

/**
 * Url check reguar expression
 */
const URL_CHECK_REGEXP = /^https?:\/\/((([a-z\d][a-z\d-]*[a-z\d])\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*$/i;

/**
 * Check is string is valid url
 *
 * @param input - String
 *
 * @returns Check result
 */
export const isValidUrl = (input: string): boolean => URL_CHECK_REGEXP.test(input);

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
export const nonosToCoins = (
  value: string, currencyCode: InvoiceCurrency, currencies: Currencies,
): string => {
  let result = value;

  // Use default value as `8` if decimals property is lost
  const numberOfNanosSigns = currencies[currencyCode]?.decimals || 8;
  const zerosNeed = numberOfNanosSigns - result.length;

  if (zerosNeed > 0) {
    let zeros = '';
    for (let i = 0; i < zerosNeed; i += 1) zeros += '0';
    result = zeros + result;
  }

  if (result.length === numberOfNanosSigns) result = `0.${result}`;
  else {
    const pointPosition = result.length - numberOfNanosSigns;
    result = `${result.substr(0, pointPosition)}.${result.substr(pointPosition)}`;
  }

  // Remove trailing zeros
  return result.replace(/0+$/, '');
};

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
export const prepareCreateInvoiceOptions = (
  options: CreateInvoiceOptions,
): CreateInvoiceBackendOptions => {
  // Check is options object valid
  if (options.description && options.description.length > 1024) {
    throw new Error('Description can\'t be longer than 1024 characters');
  }
  if (options.paidBtnName && !options.paidBtnUrl) {
    throw new Error('Require paidBtnUrl parameter if paidBtnName parameter pass');
  }

  let payload: string;
  if (options.payload !== undefined) {
    if (typeof options.payload === 'string') payload = options.payload;
    else payload = JSON.stringify(options.payload);

    if (payload.length > 4096) {
      throw new Error('Payload can\'t be longer than 4096 characters');
    }
  }

  // Create object with required parameters
  const prepared: CreateInvoiceBackendOptions = {
    asset: options.currency,
    amount: +options.amount,
  };

  // Same names
  if (options.description !== undefined) prepared.description = options.description;
  if (payload !== undefined) prepared.payload = payload;

  // Different names
  if (options.paidBtnUrl !== undefined) prepared.paid_btn_url = options.paidBtnUrl;
  if (options.paidBtnName !== undefined) prepared.paid_btn_name = options.paidBtnName;
  if (options.isAllowComments !== undefined) prepared.allow_comments = options.isAllowComments;
  if (options.isAllowAnonymous !== undefined) prepared.allow_anonymous = options.isAllowAnonymous;

  return prepared;
};

/**
 * Convert {@link GetInvoicesOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoices} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export const prepareGetInvoicesOptions = (
  options: GetInvoicesOptions,
): GetInvoicesBackendOptions => {
  // Create empty object, method doesn't have required parameters
  const prepared: GetInvoicesBackendOptions = {};

  // Same names
  if (options.status !== undefined) prepared.status = options.status;
  if (options.offset !== undefined) prepared.offset = options.offset;
  if (options.count !== undefined) prepared.count = options.count;

  // Different names
  if (options.currency !== undefined) prepared.asset = options.currency;
  if (options.ids !== undefined) {
    prepared.invoice_ids = options.ids.map((value: number | string): number => +value);
  }

  return prepared;
};

/**
 * Convert {@link GetInvoicesPaginateOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoices} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export const prepareGetInvoicesPaginateOptions = (
  pageSize: number, options: GetInvoicesPaginateOptions,
): GetInvoicesBackendOptions => {
  // Create empty object, method doesn't have required parameters
  const prepared: GetInvoicesBackendOptions = {};

  // Same names
  if (options.status !== undefined) prepared.status = options.status;

  // Different names
  if (options.currency !== undefined) prepared.asset = options.currency;
  if (options.ids !== undefined) {
    prepared.invoice_ids = options.ids.map((value: number | string): number => +value);
  }

  // Paginate options
  let page = options.page ? +options.page : 1;
  if (page < 1) page = 1;
  prepared.count = pageSize;
  prepared.offset = pageSize * (page - 1);

  return prepared;
};
