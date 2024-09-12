import {
  InvoiceCurrency, InvoiceStatus, PaidBtnName, nonosToCoins,
} from './utils';

/** Result type for {@link Client.getBalances} method */
export type Balances = { [key: string]: string };

export type CurrencyCode =
  'USDT' | 'TON' | 'BTC' | 'LTC' | 'ETH' | 'BNB' | 'TRX' | 'USDC' | 'JET' | 'RUB' | 'USD' | 'EUR' |
  'BYN' | 'UAH' | 'GBP' | 'CNY' | 'KZT' | 'UZS' | 'GEL' | 'TRY' | 'AMD' | 'THB' | 'INR' | 'BRL' |
  'IDR' | 'AZN' | 'AED' | 'PLN' | 'ILS' | 'KGS' | 'TJS';

/** Possible currencies types */
export enum CurrencyType {
  Blockchain = 'blockchain',
  Fiat = 'fiat',
  Stablecoin = 'stablecoin',
  Unknown = 'unknown',
}

/**
 * Currency type object for {@link Store.getCurrencies}
 * and {@link Client.getCurrency} methods results
 */
export type Currency = {
  /** Currency code */
  code: CurrencyCode,
  /** Currency name */
  name: string,
  /** Crypto currency office website url */
  url?: string,
  /** Currency decimals count */
  decimals: number,
  /** Currency type */
  type: CurrencyType,
};

/** Result type for {@link Store.getCurrencies} method */
export type Currencies = { [variant in CurrencyCode]?: Currency };

/**
 * Exchange rate type object for {@link Store.getExchangeRates}
 * and {@link Client.getExchangeRate} methods results
 *
 * @remarks
 * Used strings for currencies codes instead of {@link InvoiceCurrency},
 * because exchange rates contains fiat currencies, who do not take part in other methods
 */
export type ExchangeRate = {
  /** Source currency code */
  source: string,
  /** Target currency code */
  target: string,
  /** Source to target exchange rate */
  rate: number,
};

/** Result type for {@link Store.getExchangeRates} method */
export type ExchangeRates = ExchangeRate[];

/**
 * Invoice type object for {@link Client.getInvoices}, {@link Client.getInvoicesPaginate},
 * {@link Client.createInvoice} methods results and {@link ClientEmitter} `paid` event emit
 */
export type Invoice = {
  /** Invoice identifier */
  id: number,
  /** Invoice status */
  status: InvoiceStatus,
  /** Invoice hash */
  hash: string,
  /** Invoice currency code */
  currency: InvoiceCurrency,
  /** Invoice amount */
  amount: number,
  /** Invoice pay url for user */
  payUrl: string,
  /** Is invoice allow user comment */
  isAllowComments: boolean,
  /** Is user can pay invoice anonymously */
  isAllowAnonymous: boolean,
  /** Invoice created date */
  createdAt: Date,
  /** Is invoice paid anonymously, only for paid invoice */
  isPaidAnonymously?: boolean,
  /** Invoice paid date, only for paid invoice */
  paidAt?: Date,
  /** Invoice displayed to user description, only if `description` passed in invoice creation */
  description?: string,
  /**
   * Invoice visible only to app payload, only if `payload` passed in invoice creation
   *
   * If for invoice creation passed not string in this field, will be converted by JSON.parse
   */
  payload?: any,
  /**
   * Invoice left user comment, only if set `isAllowComments` to true in invoice creation
   * and user left comment
   */
  comment?: string,
  /**
   * Invoice displayed to user paid button name,
   * only if `paidBtnName` passed in invoice creation
   */
  paidBtnName?: PaidBtnName,
  /**
   * Invoice displayed to user paid button url,
   * only if `paidBtnUrl` passed in invoice creation
   */
  paidBtnUrl?: string,
};

/**
 * Invoices type object for {@link Client.getInvoices}
 * and {@link Client.getInvoicesPaginate} methods results
 */
export type Invoices = {
  /** All items count value */
  count: number,
  /** Fetched by passed filters items slice */
  items: Invoice[],
};

/**
 * Invoices type object for {@link Client.getInvoicesPaginate} methods results
 */
export type InvoicesPaginated = {
  /** Pagination page number */
  page: number,
  /** Pagination pages count */
  pagesCount: number,
  /** Fetched by passed filters items slice */
  items: Invoice[],
};

/** Result type object for {@link Client.getMe} method */
export type Me = {
  /** App identifier */
  id: number,
  /** App name */
  name: string,
  /** Using Telegram bot username */
  bot: string,
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
export const toBalances = (
  input: any, currencies: Currencies, isReturnInNanos: boolean,
): Balances => {
  if (!Array.isArray(input)) return {};

  // Conver array to HashMap structure
  return input.reduce((accumulator: Balances, value: any): Balances => {
    if (value.currency_code && value.available) {
      accumulator[value.currency_code] = isReturnInNanos
        ? value.available
        : nonosToCoins(
          value.available, value.currency_code, currencies,
        );
    }
    return accumulator;
  }, {});
};

/**
 * Convert backend API result to library result object to return in
 * {@link Store.getCurrencies} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toCurrencies = (input: any): Currencies => {
  if (!Array.isArray(input)) return {};

  return input.reduce((accumulator: Currencies, value: any): Currencies => {
    if (value.code) {
      const code: CurrencyCode = value.code.toString();

      let type = CurrencyType.Unknown;
      if (value.is_blockchain) type = CurrencyType.Blockchain;
      if (value.is_fiat) type = CurrencyType.Fiat;
      if (value.is_stablecoin) type = CurrencyType.Stablecoin;

      const currency: Currency = {
        code: code,
        name: value.name || '',
        decimals: value.decimals || 0,
        type,
      };

      if (Object.prototype.hasOwnProperty.call(value, 'url')) currency.url = value.url;

      accumulator[code] = currency;
    }
    return accumulator;
  }, {});
};

/**
 * Convert backend API result to library result object to return in
 * {@link Store.getExchangeRates} method result
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toExchangeRates = (input: any): ExchangeRates => {
  if (!Array.isArray(input)) return [];

  return input.map((value: any): ExchangeRate => ({
    source: value.source || '',
    target: value.target || '',
    rate: parseFloat(value.rate),
  }));
};

/**
 * Convert backend API result to library result object to return in
 * {@link Client.createInvoice} method, {@link toInvoices} function
 * and {@link ClientEmitter} `paid` event emit
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toInvoice = (input: any): Invoice => {
  const invoice: Invoice = {
    id: input.invoice_id || 0,
    status: input.status || '',
    hash: input.hash || '',
    currency: input.asset || '',
    amount: parseFloat(input.amount) || 0,
    payUrl: input.pay_url || '',
    isAllowComments: input.allow_comments || false,
    isAllowAnonymous: input.allow_anonymous || false,
    createdAt: new Date(input.created_at),
  };

  if (input.paid_anonymously !== undefined) invoice.isPaidAnonymously = input.paid_anonymously;
  if (input.paid_at !== undefined) invoice.paidAt = new Date(input.paid_at);
  if (input.description !== undefined) invoice.description = input.description;
  if (input.paid_btn_name !== undefined) invoice.paidBtnName = input.paid_btn_name;
  if (input.paid_btn_url !== undefined) invoice.paidBtnUrl = input.paid_btn_url;
  if (input.comment !== undefined) invoice.comment = input.comment;
  if (input.payload !== undefined) {
    let payload: any;

    try {
      payload = JSON.parse(input.payload);
    } catch {
      payload = input.payload;
    }

    invoice.payload = payload;
  }

  return invoice;
};

/**
 * Convert backend API result to library result object to return in
 * {@link Client.getInvoices} and {@link Client.getInvoicesPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toInvoices = (input: any): Invoices => {
  let items: Invoice[] = [];

  if (Array.isArray(input.items)) items = input.items.map(toInvoice);

  return {
    count: input.count || 0,
    items,
  };
};

/**
 * Convert backend API result to library result object to return in
 * {@link Client.getInvoicesPaginate} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toInvoicesPaginated = (
  page: number, pageSize: number, input: any,
): InvoicesPaginated => {
  let items: Invoice[] = [];

  if (Array.isArray(input.items)) items = input.items.map(toInvoice);

  return {
    page,
    pagesCount: Math.ceil((input.count || 0) / pageSize),
    items,
  };
};

/**
 * Convert backend API result to library result object to return in
 * {@link Store.getMe} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toMe = (input: any): Me => ({
  id: input.app_id || 0,
  name: input.name || '',
  bot: input.payment_processing_bot_username || '',
});
