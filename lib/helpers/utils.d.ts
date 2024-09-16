import { CurrencyType, CryptoCurrencyCode, FiatCurrencyCode, InvoiceStatus, CheckStatus, ExchangeRates } from './casts';
/** Possible backend API methods names */
export type ApiMethod = 'getMe' | 'getStats' | 'createInvoice' | 'createCheck' | 'deleteInvoice' | 'deleteCheck' | 'getInvoices' | 'getChecks' | 'getBalance' | 'getExchangeRates' | 'getCurrencies' | 'transfer' | 'getTransfers';
/** Options object type for {@link Client.getStats} method */
export type GetStatsOptions = {
    /** Date from which start calculating statistics */
    startAt?: Date;
    /** The date on which to finish calculating statistics */
    endAt?: Date;
};
/** Backend options object type for {@link Client.getStats} method */
export type GetStatsBackendOptions = {
    /** Date from which start calculating statistics */
    start_at?: string;
    /** The date on which to finish calculating statistics */
    end_at?: string;
};
/** Options object type for {@link Client.transfer} method */
export type TransferOptions = {
    /** User ID in Telegram */
    userId: number;
    /** Transfer asset */
    asset: CryptoCurrencyCode;
    /** Transfer amount */
    amount: number | string;
    /**
     * Random UTF-8 string unique per transfer for idempotent requests.
     * The same spend_id can be accepted only once from your app.
     * Up to 64 symbols.
     */
    spendId: string;
    /**
     * Comment for the transfer.
     * Users will see this comment in the notification about the transfer
     */
    comment?: string;
    /** Pass true to not send to the user the notification about the transfer */
    disableSendNotification?: boolean;
};
/** Backend options object type for {@link Client.transfer} method */
export type TransferBackendOptions = {
    /** User ID in Telegram */
    user_id: number;
    /** Transfer asset */
    asset: CryptoCurrencyCode;
    /** Transfer amount */
    amount: number | string;
    /**
     * Random UTF-8 string unique per transfer for idempotent requests.
     * The same spend_id can be accepted only once from your app.
     * Up to 64 symbols.
     */
    spend_id: string;
    /**
     * Comment for the transfer.
     * Users will see this comment in the notification about the transfer
     */
    comment?: string;
    /** Pass true to not send to the user the notification about the transfer */
    disable_send_notification?: boolean;
};
/** Options object type for {@link Client.createCheck} method */
export type CreateCheckOptions = {
    /** Check asset */
    asset: CryptoCurrencyCode;
    /** Check amount */
    amount: number | string;
    /** ID of the user who will be able to activate the check */
    pinToUserId?: number;
    /** A user with the specified username will be able to activate the check */
    pinToUsername?: string;
};
/** Backend options object type for {@link Client.createCheck} method */
export type CreateCheckBackendOptions = {
    /** Invoice asset */
    asset: CryptoCurrencyCode;
    /** Invoice amount */
    amount: string;
    /** ID of the user who will be able to activate the check */
    pin_to_user_id?: number;
    /** A user with the specified username will be able to activate the check */
    pin_to_username?: string;
};
/** Options object type for {@link Client.createInvoice} method */
export type CreateInvoiceOptions = {
    /** Invoice amount */
    amount: number | string;
    /** Currency type */
    currencyType?: CurrencyType.Crypto | CurrencyType.Fiat;
    /** Invoice asset */
    asset?: CryptoCurrencyCode;
    /** Invoice fiat */
    fiat?: FiatCurrencyCode;
    /** List of cryptocurrency alphabetic codes */
    acceptedAssets?: CryptoCurrencyCode[];
    /** Invoice description, displayed to user, up to 1024 symbols */
    description?: string;
    /**
     * Invoice payload, visible only for app, if it not string, JSON.stringify using
     * for preparing to backend API parameters, may be up to 4096 symbols after preparing
     */
    payload?: any;
    /** Url for button which will be shown when invoice was paid */
    paidBtnUrl?: string;
    /** Text for button which will be shown when invoice was paid */
    paidBtnName?: PaidBtnName;
    /** Is can user leave a comment for invoice */
    isAllowComments?: boolean;
    /** Is can user pay invoice anonymously */
    isAllowAnonymous?: boolean;
    /** Text of the message which will be presented to a user after the invoice is paid */
    hiddenMessage?: string;
    /** You can set a payment time limit for the invoice in seconds */
    expiresIn?: number;
};
/** Backend options object type for {@link Client.createInvoice} method */
export type CreateInvoiceBackendOptions = {
    /** Invoice amount */
    amount: string;
    /** Currency type */
    currency_type?: CurrencyType.Crypto | CurrencyType.Fiat;
    /** Invoice asset */
    asset?: CryptoCurrencyCode;
    /** Invoice fiat */
    fiat?: FiatCurrencyCode;
    /** List of cryptocurrency alphabetic codes separated comma */
    accepted_assets?: string;
    /** Invoice description, displayed to user */
    description?: string;
    /** Invoice payload, visible only for app */
    payload?: string;
    /** Url for button which will be shown when invoice was paid */
    paid_btn_url?: string;
    /** Text for button which will be shown when invoice was paid */
    paid_btn_name?: PaidBtnName;
    /** Is can user leave a comment for invoice */
    allow_comments?: boolean;
    /** Is can user pay invoice anonymously */
    allow_anonymous?: boolean;
    /** Text of the message which will be presented to a user after the invoice is paid */
    hidden_message?: string;
    /** You can set a payment time limit for the invoice in seconds */
    expires_in?: number;
};
/** Options object type for {@link Client.getInvoices} method */
export type GetInvoicesOptions = {
    /** Invoices crypto currency filter */
    asset?: CryptoCurrencyCode;
    /** Invoices fiat currency filter */
    fiat?: FiatCurrencyCode;
    /** Invoices identifiers filter */
    ids?: number[];
    /** Invoices status filter */
    status?: GetInvoicesStatus;
    /** Number of invoices to skip */
    offset?: number;
    /** Number of invoices returned */
    count?: number;
};
/** Options object type for {@link Client.getInvoicesPaginate} method */
export type GetInvoicesPaginateOptions = {
    /** Invoices crypto currency filter */
    asset?: CryptoCurrencyCode;
    /** Invoices fiat currency filter */
    fiat?: FiatCurrencyCode;
    /** Invoices identifiers filter */
    ids?: number[];
    /** Invoices status filter */
    status?: GetInvoicesStatus;
    /** Pagination page number */
    page?: number;
};
/**
 * Backend options object type for {@link Client.getInvoices}
 * and {@link Client.getInvoicesPaginate} methods
 */
export type GetInvoicesBackendOptions = {
    /** Invoices crypto currency filter */
    asset?: CryptoCurrencyCode;
    /** Invoices fiat currency filter */
    fiat?: FiatCurrencyCode;
    /** Invoices identifiers filter */
    invoice_ids?: string;
    /** Invoices status filter */
    status?: GetInvoicesStatus;
    /** Number of invoices to skip */
    offset?: number;
    /** Number of invoices returned */
    count?: number;
};
/** Options object type for {@link Client.getChecks} method */
export type GetChecksOptions = {
    /** Checks asset filter */
    asset?: CryptoCurrencyCode;
    /** Checks identifiers filter */
    ids?: number[];
    /** Checks status filter */
    status?: GetChecksStatus;
    /** Number of checks to skip */
    offset?: number;
    /** Number of checks returned */
    count?: number;
};
/** Options object type for {@link Client.getChecksPaginate} method */
export type GetChecksPaginateOptions = {
    /** Checks asset filter */
    asset?: CryptoCurrencyCode;
    /** Checks identifiers filter */
    ids?: number[];
    /** Checks status filter */
    status?: GetChecksStatus;
    /** Pagination page number */
    page?: number;
};
/**
 * Backend options object type for {@link Client.getChecks}
 * and {@link Client.getChecksPaginate} methods
 */
export type GetChecksBackendOptions = {
    /** Checks asset filter */
    asset?: CryptoCurrencyCode;
    /** Checks identifiers filter */
    check_ids?: string;
    /** Checks status filter */
    status?: GetChecksStatus;
    /** Number of checks to skip */
    offset?: number;
    /** Number of checks returned */
    count?: number;
};
/** Options object type for {@link Client.getTransfers} method */
export type GetTransfersOptions = {
    /** Transfer asset filter */
    asset?: CryptoCurrencyCode;
    /** Transfers identifiers filter */
    ids?: number[];
    /** Transfer spend identifier */
    spendId?: string;
    /** Number of transfers to skip */
    offset?: number;
    /** Number of transfers returned */
    count?: number;
};
/** Options object type for {@link Client.getTransfersPaginate} method */
export type GetTransfersPaginateOptions = {
    /** Transfer asset filter */
    asset?: CryptoCurrencyCode;
    /** Transfers identifiers filter */
    ids?: number[];
    /** Transfer spend identifier */
    spendId?: string;
    /** Pagination page number */
    page?: number;
};
/**
 * Backend options object type for {@link Client.getTransfers}
 * and {@link Client.getTransfersPaginate} methods
 */
export type GetTransfersBackendOptions = {
    /** Transfer asset filter */
    asset?: CryptoCurrencyCode;
    /** Transfers identifiers filter */
    transfer_ids?: string;
    /** Transfer spend identifier */
    spend_id?: string;
    /** Number of transfers to skip */
    offset?: number;
    /** Number of transfers returned */
    count?: number;
};
/**
 * Possible invoices statuses
 * - {@link InvoiceStatus.Active} - Unpaid invoice
 * - {@link InvoiceStatus.Paid} - Paid invoice
 */
export type GetInvoicesStatus = InvoiceStatus.Active | InvoiceStatus.Paid;
/**
 * Possible checks statuses
 * - {@link CheckStatus.Active} - Active check
 * - {@link CheckStatus.Activated} - Activated check
 */
export type GetChecksStatus = CheckStatus.Active | CheckStatus.Activated;
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
 *
 * @returns Exchange rate or zero, if currencies pair not exists
 */
export declare const getExchageRate: (source: string, target: string, exchangeRates: ExchangeRates) => string;
/**
 * Check is string is valid url
 *
 * @param input - String
 *
 * @returns Check result
 */
export declare const isValidUrl: (input: string) => boolean;
/**
 * Convert {@link GetStatsOptions} object to using backend API method
 * parameters {@link GetStatsBackendOptions} object
 *
 * @param options - Library {@link Client.getStats} method options object
 *
 * @throws Error - If options object invalid
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetStatsOptions: (options: GetStatsOptions) => GetStatsBackendOptions;
/**
 * Convert {@link CreateCheckOptions} object to using backend API method
 * parameters {@link CreateCheckBackendOptions} object
 *
 * @param options - Library {@link Client.createCheck} method options object
 *
 * @throws Error - If options object invalid
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareTransferOptions: (options: TransferOptions) => TransferBackendOptions;
/**
 * Convert {@link CreateCheckOptions} object to using backend API method
 * parameters {@link CreateCheckBackendOptions} object
 *
 * @param options - Library {@link Client.createCheck} method options object
 *
 * @throws Error - If options object invalid
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareCreateCheckOptions: (options: CreateCheckOptions) => CreateCheckBackendOptions;
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
export declare const prepareCreateInvoiceOptions: (options: CreateInvoiceOptions) => CreateInvoiceBackendOptions;
/**
 * Convert identifier to using backend API delete methods
 *
 * @param id - Passed identifier
 *
 * @throws Error - If options identifier invalid
 *
 * @returns Identifier number
 */
export declare const prepareDeleteOptions: (id: any) => number;
/**
 * Convert {@link GetInvoicesOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoices} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetInvoicesOptions: (options: GetInvoicesOptions) => GetInvoicesBackendOptions;
/**
 * Convert {@link GetInvoicesPaginateOptions} object to using backend API method
 * parameters {@link GetInvoicesBackendOptions} object
 *
 * @param options - Library {@link Client.getInvoicesPaginate} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetInvoicesPaginateOptions: (pageSize: number, options: GetInvoicesPaginateOptions) => GetInvoicesBackendOptions;
/**
 * Convert {@link GetChecksOptions} object to using backend API method
 * parameters {@link GetChecksBackendOptions} object
 *
 * @param options - Library {@link Client.getChecks} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetChecksOptions: (options: GetChecksOptions) => GetChecksBackendOptions;
/**
 * Convert {@link GetChecksPaginateOptions} object to using backend API method
 * parameters {@link GetChecksBackendOptions} object
 *
 * @param options - Library {@link Client.getChecksPaginate} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetChecksPaginateOptions: (pageSize: number, options: GetChecksPaginateOptions) => GetChecksBackendOptions;
/**
 * Convert {@link GetTransfersOptions} object to using backend API method
 * parameters {@link GetTransfersBackendOptions} object
 *
 * @param options - Library {@link Client.getTransfers} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetTransfersOptions: (options: GetTransfersOptions) => GetTransfersBackendOptions;
/**
 * Convert {@link GetTransfersPaginateOptions} object to using backend API method
 * parameters {@link GetTransfersBackendOptions} object
 *
 * @param options - Library {@link Client.getTransfersPaginate} method options object
 *
 * @returns Object with corresponding backend API method parameters
 */
export declare const prepareGetTransfersPaginateOptions: (pageSize: number, options: GetTransfersPaginateOptions) => GetTransfersBackendOptions;
