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
  'USDT' | 'TON' | 'GRAM' | 'NOT' | 'MY' | 'DOGS' | 'BTC' | 'LTC' | 'ETH' | 'BNB' | 'TRX' | 'WIF' |
  'USDC' | 'TRUMP' | 'MELANIA' | 'SOL' | 'DOGE' | 'PEPE' | 'BONK' | 'MAJOR' | 'HMSTR' | 'CATI';

// Fiat currency codes
export type FiatCurrencyCode =
  'USD' | 'EUR' | 'RUB' | 'BYN' | 'UAH' | 'GBP' | 'CNY' | 'KZT' | 'UZS' | 'GEL' | 'TRY' | 'AMD' |
  'THB' | 'INR' | 'BRL' | 'IDR' | 'AZN' | 'AED' | 'PLN' | 'ILS' | 'KGS' | 'TJS';

// All curerencies codes
export type CurrencyCode = CryptoCurrencyCode | FiatCurrencyCode;

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

/** Possible check statuses */
export enum CheckStatus {
  Active = 'active',
  Activated = 'activated',
  Unknown = 'unknown',
}

/** Possible transfer statuses */
export enum TransferStatus {
  Completed = 'completed',
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
 */
export type ExchangeRate = {
  /** Source currency code */
  source: CurrencyCode,
  /** Target currency code */
  target: CurrencyCode,
  /** Source to target exchange rate */
  rate: string,
  /** True, if the received rate is up-to-date */
  isValid: boolean,
};

/** Result type for {@link Store.getExchangeRates} method */
export type ExchangeRates = ExchangeRate[];

/**
 * Transfer type object for {@link Client.getTransfers} and {@link Client.transfer} methods results
 */
export type Transfer = {
  /** Transfer identifier */
  id: number,
  /**
   * Transfer spend identifier, optional because not returned from `transfer` API method call
   */
  spendId?: string,
  /** Telegram user ID the transfer was sent to */
  userId: number,
  /** Transfer asset */
  asset: CryptoCurrencyCode,
  /** Transfer amount */
  amount: string,
  /** Transfer status */
  status: TransferStatus,
  /** Transfer completed date */
  completedAt: Date,
  /** Check activated date */
  comment?: string,
};

/**
 * Check type object for {@link Client.getChecks}, {@link Client.getChecksPaginate}
 * and {@link Client.createCheck} methods results
 */
export type Check = {
  /** Check identifier */
  id: number,
  /** Check hash */
  hash: string,
  /** Check asset */
  asset: CryptoCurrencyCode,
  /** Check amount */
  amount: string,
  /** Check receive url for user by bot */
  botCheckUrl: string,
  /** Check status */
  status: CheckStatus,
  /** Check created date */
  createdAt: Date,
  /** Check activated date */
  activatedAt?: Date,
  /**
   * ID of the user who will be able to activate the check,
   * only if passed in check creation,
   * if exists, field `pinToUsername` will be absent
   */
  pinToUserId?: number,
  /**
   * A user with the specified username will be able to activate the check,
   * only if passed in check creation,
   * if exists, field `pinToUserId` will be absent
   */
  pinToUsername?: string,
};

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
  amount: string,
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

/** Result type object for {@link Client.getStats} method */
export type Stats = {
  /** Total volume of paid invoices in USD */
  volume: string,
  /** Conversion of all created invoices */
  conversion: string,
  /** The unique number of users who have paid the invoice */
  uniqueUsersCount: number,
  /** Total created invoice count */
  createdInvoiceCount: number,
  /** Total paid invoice count */
  paidInvoiceCount: number,
  /** The date on which the statistics calculation was started */
  startAt: Date,
  /** The date on which the statistics calculation was ended */
  endAt: Date,
};

/** Result type object for {@link Store.getMe} method */
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
    rate: value.rate,
    isValid: value.is_valid,
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
    amount: input.amount || '0',
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
 * {@link Client.createCheck} method and {@link toChecks} function
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toCheck = (input: any): Check => {
  const check: Check = {
    id: input.check_id || 0,
    hash: input.hash || '',
    asset: input.asset || '',
    amount: input.amount || '0',
    botCheckUrl: input.bot_check_url || '',
    status: input.status || CheckStatus.Unknown,
    createdAt: new Date(input.created_at),
  };

  if (input.activated_at !== undefined) check.activatedAt = new Date(input.activated_at);
  if (input.pin_to_user !== undefined && input.pin_to_user.pin_by !== undefined) {
    if (input.pin_to_user.pin_by === 'id' && input.pin_to_user.user_id !== undefined) {
      check.pinToUserId = input.pin_to_user.user_id;
    }
    if (input.pin_to_user.pin_by === 'username' && input.pin_to_user.username !== undefined) {
      check.pinToUsername = input.pin_to_user.username;
    }
  }

  return check;
};

/**
 * Convert backend API result to library result object to return in
 * {@link Client.transfer} method and {@link toTransfers} function
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toTransfer = (input: any): Transfer => {
  const transfer: Transfer = {
    id: input.transfer_id || 0,
    userId: input.user_id || 0,
    asset: input.asset || '',
    amount: input.amount || '0',
    status: input.status || TransferStatus.Unknown,
    completedAt: new Date(input.completed_at),
  };

  if (input.spend_id !== undefined) transfer.spendId = input.spend_id;
  if (input.comment !== undefined) transfer.comment = input.comment;

  return transfer;
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
 * {@link Client.getChecks} and {@link Client.getChecksPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toChecks = (input: any): Check[] => {
  let items: Check[] = [];

  if (Array.isArray(input.items)) items = input.items.map(toCheck);

  return items;
};

/**
 * Convert backend API result to library result object to return in
 * {@link Client.getTransfers} and {@link Client.getTransfersPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toTransfers = (input: any): Transfer[] => {
  let items: Transfer[] = [];

  if (Array.isArray(input.items)) items = input.items.map(toTransfer);

  return items;
};

/**
 * Convert backend API result to library result object to return in
 * {@link Client.getStats} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export const toStats = (input: any): Stats => ({
  volume: input.volume || '0',
  conversion: input.conversion || '0',
  uniqueUsersCount: input.unique_users_count || 0,
  createdInvoiceCount: input.created_invoice_count || 0,
  paidInvoiceCount: input.paid_invoice_count || 0,
  startAt: new Date(input.start_at ? input.start_at : 0),
  endAt: new Date(input.end_at ? input.end_at : 0),
});

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
