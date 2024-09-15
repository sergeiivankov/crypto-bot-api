import { PaidBtnName } from './utils';

/** Result type value for {@link Client.getBalances} method */
export type Balance = {
  // Available balance
  available: string,
  // Balance on hold
  onhold: string,
};

/** Result type for {@link Client.getBalances} method */
export type Balances = { [variant in CryptoCurrencyCode]: Balance };

/** Result type for {@link Client.getBalances} method */
export type BalancesType = { [variant in CryptoCurrencyCode]: string };

// Crypto currency codes
export type CryptoCurrencyCode =
  'USDT' | 'TON' | 'BTC' | 'ETH' | 'LTC' | 'BNB' | 'TRX' | 'USDC' | 'JET';

// Fiat currency codes
export type FiatCurrencyCode =
  'USD' | 'EUR' | 'RUB' | 'BYN' | 'UAH' | 'GBP' | 'CNY' | 'KZT' | 'UZS' | 'GEL' | 'TRY' | 'AMD' |
  'THB' | 'INR' | 'BRL' | 'IDR' | 'AZN' | 'AED' | 'PLN' | 'ILS';

// All curerencies codes, `getCurrencies` API method return also 'KGS' and 'TJS' fiat currencies,
// so I add it's here
// TODO: check availability of creating invoices with this currencies
export type CurrencyCode = CryptoCurrencyCode | FiatCurrencyCode | 'KGS' | 'TJS';

/** Possible currency types */
export enum CurrencyType {
  Crypto = 'crypto',
  Fiat = 'fiat',
  Unknown = 'unknown',
}

/** Possible detailed currency types */
export enum DetailedCurrencyType {
  Blockchain = 'blockchain',
  Stablecoin = 'stablecoin',
  Fiat = CurrencyType.Fiat,
  Unknown = CurrencyType.Unknown,
}

/** Possible invoice statuses */
export enum InvoiceStatus {
  Active = 'active',
  Paid = 'paid',
  Expired = 'expired',
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
  type: DetailedCurrencyType,
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
  /** Invoice currency type */
  currencyType: CurrencyType,
  /** Invoice currency code */
  currency: CurrencyCode,
  /** Invoice amount */
  amount: number,
  /** Invoice pay url for user by bot */
  botPayUrl: string,
  /** Invoice pay url for user by mini app */
  miniAppPayUrl: string,
  /** Invoice pay url for user by web app */
  webAppPayUrl: string,
  /** Is invoice allow user comment */
  isAllowComments: boolean,
  /** Is user can pay invoice anonymously */
  isAllowAnonymous: boolean,
  /** Invoice created date */
  createdAt: Date,
  /** Text of the hidden message, only if set in invoice creation */
  hiddenMessage?: string,
  /** Is invoice paid anonymously, only for paid invoice */
  isPaidAnonymously?: boolean,
  /** Invoice paid date, only for paid invoice */
  paidAt?: Date,
  /** Expiration date, only if set pay limit time in invoice creation */
  expirationDate?: Date,
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
  /**
   * Asset of service fees charged when the invoice was paid, only if status is InvoiceStatus.Paid
   */
  feeAsset?: CryptoCurrencyCode,
  /**
   * Amount of service fees charged when the invoice was paid, only if status is InvoiceStatus.Paid
   */
  fee?: number,
  /**
   * Price of the asset in USD, only if status is InvoiceStatus.Paid
   */
  usdRate?: number,
  /**
   * List of assets which can be used to pay the invoice, only if set in invoice creation
   */
  acceptedAssets?: CryptoCurrencyCode[],
  /**
   * Cryptocurrency alphabetic code for which the invoice was paid,
   * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
   */
  paidAsset?: CryptoCurrencyCode,
  /**
   * Amount of the invoice for which the invoice was paid,
   * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
   */
  paidAmount?: number,
  /**
   * The rate of the paid_asset valued in the fiat currency,
   * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
   */
  paidFiatRate?: number,
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
 *
 * @throws Error - If input parameter is not array
 *
 * @returns Converted result
 */
export const toBalances = (input: any): Balances => {
  if (!Array.isArray(input)) throw new Error(`Input is not array: ${JSON.stringify(input)}`);

  // Conver array to HashMap structure
  return input.reduce((accumulator: Balances, value: any): Balances => {
    accumulator[value.currency_code] = { available: value.available, onhold: value.onhold };
    return accumulator;
  }, {} as Balances);
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

      let type = DetailedCurrencyType.Unknown;
      if (value.is_blockchain) type = DetailedCurrencyType.Blockchain;
      if (value.is_fiat) type = DetailedCurrencyType.Fiat;
      if (value.is_stablecoin) type = DetailedCurrencyType.Stablecoin;

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
    status: input.status || InvoiceStatus.Unknown,
    hash: input.hash || '',
    currencyType: input.currency_type || '',
    currency: input.asset || input.fiat || '',
    amount: parseFloat(input.amount) || 0,
    isAllowComments: input.allow_comments || false,
    isAllowAnonymous: input.allow_anonymous || false,
    createdAt: new Date(input.created_at),
    botPayUrl: input.bot_invoice_url || '',
    miniAppPayUrl: input.mini_app_invoice_url || '',
    webAppPayUrl: input.web_app_invoice_url || '',
  };

  if (invoice.currencyType === CurrencyType.Crypto) {
    invoice.currency = input.asset || '';
  }
  if (invoice.currencyType === CurrencyType.Fiat) {
    invoice.currency = input.fiat || '';
  }

  if (input.hidden_message !== undefined) invoice.hiddenMessage = input.hidden_message;
  if (input.paid_anonymously !== undefined) invoice.isPaidAnonymously = input.paid_anonymously;
  if (input.expiration_date !== undefined) invoice.expirationDate = new Date(input.expiration_date);
  if (input.paid_at !== undefined) invoice.paidAt = new Date(input.paid_at);
  if (input.description !== undefined) invoice.description = input.description;
  if (input.paid_btn_name !== undefined) invoice.paidBtnName = input.paid_btn_name;
  if (input.paid_btn_url !== undefined) invoice.paidBtnUrl = input.paid_btn_url;
  if (input.comment !== undefined) invoice.comment = input.comment;
  if (input.paid_usd_rate !== undefined) invoice.usdRate = parseFloat(input.paid_usd_rate) || 0;
  if (input.fee_asset !== undefined) invoice.feeAsset = input.fee_asset || '';
  if (input.fee_amount !== undefined) invoice.fee = input.fee_amount || 0;
  if (input.accepted_assets !== undefined) invoice.acceptedAssets = input.accepted_assets;
  if (input.paid_asset !== undefined) invoice.paidAsset = input.paid_asset || '';
  if (input.paid_amount !== undefined) invoice.paidAmount = parseFloat(input.paid_amount) || 0;
  if (input.paid_fiat_rate !== undefined) invoice.paidFiatRate = parseFloat(input.paid_fiat_rate) || 0;
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
export const toInvoices = (input: any): Invoice[] => {
  let items: Invoice[] = [];

  if (Array.isArray(input.items)) items = input.items.map(toInvoice);

  return items;
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
