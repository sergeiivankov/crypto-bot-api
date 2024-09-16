import { PaidBtnName } from './utils';
/** Result type value for {@link Client.getBalances} method */
export type Balance = {
    available: string;
    onhold: string;
};
/** Result type for {@link Client.getBalances} method */
export type Balances = {
    [variant in CryptoCurrencyCode]: Balance;
};
/** Result type for {@link Client.getBalances} method */
export type BalancesType = {
    [variant in CryptoCurrencyCode]: string;
};
export type CryptoCurrencyCode = 'USDT' | 'TON' | 'BTC' | 'ETH' | 'LTC' | 'BNB' | 'TRX' | 'USDC' | 'JET';
export type FiatCurrencyCode = 'USD' | 'EUR' | 'RUB' | 'BYN' | 'UAH' | 'GBP' | 'CNY' | 'KZT' | 'UZS' | 'GEL' | 'TRY' | 'AMD' | 'THB' | 'INR' | 'BRL' | 'IDR' | 'AZN' | 'AED' | 'PLN' | 'ILS';
export type CurrencyCode = CryptoCurrencyCode | FiatCurrencyCode | 'KGS' | 'TJS';
/** Possible currency types */
export declare enum CurrencyType {
    Crypto = "crypto",
    Fiat = "fiat",
    Unknown = "unknown"
}
/** Possible detailed currency types */
export declare enum DetailedCurrencyType {
    Blockchain = "blockchain",
    Stablecoin = "stablecoin",
    Fiat = "fiat",
    Unknown = "unknown"
}
/** Possible invoice statuses */
export declare enum InvoiceStatus {
    Active = "active",
    Paid = "paid",
    Expired = "expired",
    Unknown = "unknown"
}
/** Possible check statuses */
export declare enum CheckStatus {
    Active = "active",
    Activated = "activated",
    Unknown = "unknown"
}
/** Possible transfer statuses */
export declare enum TransferStatus {
    Completed = "completed",
    Unknown = "unknown"
}
/**
 * Currency type object for {@link Store.getCurrencies}
 * and {@link Client.getCurrency} methods results
 */
export type Currency = {
    /** Currency code */
    code: CurrencyCode;
    /** Currency name */
    name: string;
    /** Crypto currency office website url */
    url?: string;
    /** Currency decimals count */
    decimals: number;
    /** Currency type */
    type: DetailedCurrencyType;
};
/** Result type for {@link Store.getCurrencies} method */
export type Currencies = {
    [variant in CurrencyCode]?: Currency;
};
/**
 * Exchange rate type object for {@link Store.getExchangeRates}
 * and {@link Client.getExchangeRate} methods results
 */
export type ExchangeRate = {
    /** Source currency code */
    source: CurrencyCode;
    /** Target currency code */
    target: CurrencyCode;
    /** Source to target exchange rate */
    rate: string;
    /** True, if the received rate is up-to-date */
    isValid: boolean;
};
/** Result type for {@link Store.getExchangeRates} method */
export type ExchangeRates = ExchangeRate[];
/**
 * Transfer type object for {@link Client.getTransfers} and {@link Client.transfer} methods results
 */
export type Transfer = {
    /** Transfer identifier */
    id: number;
    /**
     * Transfer spend identifier, optional because not returned from `transfer` API method call
     */
    spendId?: string;
    /** Telegram user ID the transfer was sent to */
    userId: number;
    /** Transfer asset */
    asset: CryptoCurrencyCode;
    /** Transfer amount */
    amount: string;
    /** Transfer status */
    status: TransferStatus;
    /** Transfer completed date */
    completedAt: Date;
    /** Check activated date */
    comment?: string;
};
/**
 * Check type object for {@link Client.getChecks}, {@link Client.getChecksPaginate}
 * and {@link Client.createCheck} methods results
 */
export type Check = {
    /** Check identifier */
    id: number;
    /** Check hash */
    hash: string;
    /** Check asset */
    asset: CryptoCurrencyCode;
    /** Check amount */
    amount: string;
    /** Check receive url for user by bot */
    botCheckUrl: string;
    /** Check status */
    status: CheckStatus;
    /** Check created date */
    createdAt: Date;
    /** Check activated date */
    activatedAt?: Date;
    /**
     * ID of the user who will be able to activate the check,
     * only if passed in check creation,
     * if exists, field `pinToUsername` will be absent
     */
    pinToUserId?: number;
    /**
     * A user with the specified username will be able to activate the check,
     * only if passed in check creation,
     * if exists, field `pinToUserId` will be absent
     */
    pinToUsername?: string;
};
/**
 * Invoice type object for {@link Client.getInvoices}, {@link Client.getInvoicesPaginate},
 * {@link Client.createInvoice} methods results and {@link ClientEmitter} `paid` event emit
 */
export type Invoice = {
    /** Invoice identifier */
    id: number;
    /** Invoice status */
    status: InvoiceStatus;
    /** Invoice hash */
    hash: string;
    /** Invoice currency type */
    currencyType: CurrencyType;
    /** Invoice currency code */
    currency: CurrencyCode;
    /** Invoice amount */
    amount: string;
    /** Invoice pay url for user by bot */
    botPayUrl: string;
    /** Invoice pay url for user by mini app */
    miniAppPayUrl: string;
    /** Invoice pay url for user by web app */
    webAppPayUrl: string;
    /** Is invoice allow user comment */
    isAllowComments: boolean;
    /** Is user can pay invoice anonymously */
    isAllowAnonymous: boolean;
    /** Invoice created date */
    createdAt: Date;
    /** Text of the hidden message, only if set in invoice creation */
    hiddenMessage?: string;
    /** Is invoice paid anonymously, only for paid invoice */
    isPaidAnonymously?: boolean;
    /** Invoice paid date, only for paid invoice */
    paidAt?: Date;
    /** Expiration date, only if set pay limit time in invoice creation */
    expirationDate?: Date;
    /** Invoice displayed to user description, only if `description` passed in invoice creation */
    description?: string;
    /**
     * Invoice visible only to app payload, only if `payload` passed in invoice creation
     *
     * If for invoice creation passed not string in this field, will be converted by JSON.parse
     */
    payload?: any;
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
    /**
     * Asset of service fees charged when the invoice was paid, only if status is InvoiceStatus.Paid
     */
    feeAsset?: CryptoCurrencyCode;
    /**
     * Amount of service fees charged when the invoice was paid, only if status is InvoiceStatus.Paid
     */
    fee?: number;
    /**
     * Price of the asset in USD, only if status is InvoiceStatus.Paid
     */
    usdRate?: number;
    /**
     * List of assets which can be used to pay the invoice, only if set in invoice creation
     */
    acceptedAssets?: CryptoCurrencyCode[];
    /**
     * Cryptocurrency alphabetic code for which the invoice was paid,
     * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
     */
    paidAsset?: CryptoCurrencyCode;
    /**
     * Amount of the invoice for which the invoice was paid,
     * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
     */
    paidAmount?: number;
    /**
     * The rate of the paid_asset valued in the fiat currency,
     * only if currency type is CurrencyType.Fiat and status is InvoiceStatus.Paid
     */
    paidFiatRate?: number;
};
/** Result type object for {@link Client.getStats} method */
export type Stats = {
    /** Total volume of paid invoices in USD */
    volume: string;
    /** Conversion of all created invoices */
    conversion: string;
    /** The unique number of users who have paid the invoice */
    uniqueUsersCount: number;
    /** Total created invoice count */
    createdInvoiceCount: number;
    /** Total paid invoice count */
    paidInvoiceCount: number;
    /** The date on which the statistics calculation was started */
    startAt: Date;
    /** The date on which the statistics calculation was ended */
    endAt: Date;
};
/** Result type object for {@link Store.getMe} method */
export type Me = {
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
 *
 * @throws Error - If input parameter is not array
 *
 * @returns Converted result
 */
export declare const toBalances: (input: any) => Balances;
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
 * {@link Client.createInvoice} method, {@link toInvoices} function
 * and {@link ClientEmitter} `paid` event emit
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toInvoice: (input: any) => Invoice;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.createCheck} method and {@link toChecks} function
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toCheck: (input: any) => Check;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.transfer} method and {@link toTransfers} function
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toTransfer: (input: any) => Transfer;
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getInvoices} and {@link Client.getInvoicesPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toInvoices: (input: any) => Invoice[];
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getChecks} and {@link Client.getChecksPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toChecks: (input: any) => Check[];
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getTransfers} and {@link Client.getTransfersPaginate}
 * methods
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toTransfers: (input: any) => Transfer[];
/**
 * Convert backend API result to library result object to return in
 * {@link Client.getStats} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toStats: (input: any) => Stats;
/**
 * Convert backend API result to library result object to return in
 * {@link Store.getMe} method
 *
 * @param input - Backend API result
 *
 * @returns Converted result
 */
export declare const toMe: (input: any) => Me;
