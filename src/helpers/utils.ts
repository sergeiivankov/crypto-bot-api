import {
  Currencies, CurrencyType, CryptoCurrencyCode, FiatCurrencyCode, InvoiceStatus, ExchangeRates,
} from './casts';

/** Possible backend API methods names */
export type ApiMethod =
  'getMe' | 'createInvoice' | 'deleteInvoice' | 'deleteCheck' | 'getInvoices' | 'getBalance' |
  'getExchangeRates' | 'getCurrencies';

/** Options object type for {@link Client.createInvoice} method */
export type CreateInvoiceOptions = {
  /** Invoice amount */
  amount: number | string,
  /** Currency type */
  currencyType?: CurrencyType.Crypto | CurrencyType.Fiat,
  /** Invoice asset */
  asset?: CryptoCurrencyCode,
  /** Invoice fiat */
  fiat?: FiatCurrencyCode,
  /** List of cryptocurrency alphabetic codes */
  acceptedAssets?: CryptoCurrencyCode[],
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
  /** Text of the message which will be presented to a user after the invoice is paid */
  hiddenMessage?: string,
  /** You can set a payment time limit for the invoice in seconds */
  expiresIn?: number,
};

/** Backend options object type for {@link Client.createInvoice} method */
export type CreateInvoiceBackendOptions = {
  /** Invoice amount */
  amount: string,
  /** Currency type */
  currency_type?: CurrencyType.Crypto | CurrencyType.Fiat,
  /** Invoice asset */
  asset?: CryptoCurrencyCode,
  /** Invoice fiat */
  fiat?: FiatCurrencyCode,
  /** List of cryptocurrency alphabetic codes separated comma */
  accepted_assets?: string,
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
  /** Text of the message which will be presented to a user after the invoice is paid */
  hidden_message?: string,
  /** You can set a payment time limit for the invoice in seconds */
  expires_in?: number,
};

/** Options object type for {@link Client.getInvoices} method */
export type GetInvoicesOptions = {
  /** Invoices crypto currency filter */
  asset?: CryptoCurrencyCode,
  /** Invoices fiat currency filter */
  fiat?: FiatCurrencyCode,
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
  /** Invoices crypto currency filter */
  asset?: CryptoCurrencyCode,
  /** Invoices fiat currency filter */
  fiat?: FiatCurrencyCode,
  /** Invoices identifiers filter */
  ids?: (number | string)[],
  /** Invoices status filter */
  status?: GetInvoicesStatus,
  /** Pagination page number */
  page?: number,
};

/** Backend options object type for {@link Client.getInvoices} method */
export type GetInvoicesBackendOptions = {
  /** Invoices crypto currency filter */
  asset?: CryptoCurrencyCode,
  /** Invoices fiat currency filter */
  fiat?: FiatCurrencyCode,
  /** Invoices identifiers filter */
  invoice_ids?: number[],
  /** Invoices status filter */
  status?: GetInvoicesStatus,
  /** Number of invoices to skip */
  offset?: number,
  /** Number of invoices returned */
  count?: number,
};

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
  if (options.description !== undefined && options.description.length > 1024) {
    throw new Error('Description can\'t be longer than 1024 characters');
  }
  if (options.paidBtnName !== undefined && !options.paidBtnUrl) {
    throw new Error('Require paidBtnUrl parameter if paidBtnName parameter pass');
  }
  if (options.hiddenMessage !== undefined && options.hiddenMessage.length > 2048) {
    throw new Error('Hidden message can\'t be longer than 2048 characters');
  }
  if (
    options.expiresIn !== undefined
    && (typeof options.expiresIn !== 'number'
      || options.expiresIn < 1
      || options.expiresIn > 2678400)
  ) {
    throw new Error('Expires must be a number between 1-2678400');
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
    amount: typeof options.amount === 'number' ? '' + options.amount : options.amount,
  };

  const currencyType = options.currencyType || CurrencyType.Crypto;
  prepared.currency_type = currencyType;

  if (currencyType === CurrencyType.Crypto) {
    const asset = options.asset;
    if (!asset) throw new Error('Field `asset` required for crypto currency type');
    prepared.asset = asset;
  }
  if (currencyType === CurrencyType.Fiat) {
    const fiat = options.fiat;
    if (!fiat) throw new Error('Field `fiat` required for fiat currency type');
    prepared.fiat = fiat;

    if (options.acceptedAssets !== undefined) {
      if (!Array.isArray(options.acceptedAssets)) {
        throw new Error('Field `acceptedAssets` must be array');
      }
      prepared.accepted_assets = options.acceptedAssets.join(',');
    }
  }

  // Same names
  if (options.expiresIn !== undefined) prepared.expires_in = options.expiresIn;
  if (options.description !== undefined) prepared.description = options.description;
  if (options.hiddenMessage !== undefined) prepared.hidden_message = options.hiddenMessage;
  if (payload !== undefined) prepared.payload = payload;

  // Different names
  if (options.paidBtnUrl !== undefined) prepared.paid_btn_url = options.paidBtnUrl;
  if (options.paidBtnName !== undefined) prepared.paid_btn_name = options.paidBtnName;
  if (options.isAllowComments !== undefined) prepared.allow_comments = options.isAllowComments;
  if (options.isAllowAnonymous !== undefined) prepared.allow_anonymous = options.isAllowAnonymous;

  return prepared;
};

/**
 * Convert identifier to using backend API delete methods
 *
 * @param id - Passed identifier
 *
 * @throws Error - If options identifier invalid
 *
 * @returns Identifier number
 */
export const prepareDeleteOptions = (id: any): number => {
  if (typeof id !== 'number' || isNaN(id) || id < 1) {
    throw new Error('Identifier must be a valid positive number');
  }

  return id;
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
  if (options.asset !== undefined) prepared.asset = options.asset;
  if (options.fiat !== undefined) prepared.fiat = options.fiat;
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
  if (options.asset !== undefined) prepared.asset = options.asset;
  if (options.fiat !== undefined) prepared.fiat = options.fiat;
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
