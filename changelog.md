# Changelog

## Unreleased changes

- Added ability to create HTTP server, not only HTTPS
- Readme fixes

Thanks:

- [Nikita](https://github.com/asymptotee)

## 0.3.0 - 2024-09-16

- Add `getStats`, `createCheck`, `getChecks`, `getChecksPaginate`, `transfer`, `getTransfers`, `getTransfersPaginate`, `deleteInvoice` and `deleteCheck` methods
- Change methods `getInvoices` and `getInvoicesPaginate` to returns array of `Invoice`
- Remove `currency` field from `GetInvoicesOptions` and `GetInvoicesPaginateOptions` types and add `asset` and `fiat` fields
- Update `Invoice` type to actual API version
- Update `createInvoice` method to actual API version, change related options types
- Change return type of `getExchangeRate` method and field `rate` of `ExchangeRate` type which returned by `getExchangeRates` method to string
- Change `Invoice` type `amount` field type to string
- Change `getInvoices` options `ids` field type to `number[]`
- Fix `getInvoices` backend method `invoice_ids` parameter type
- Remove calculating and returning exchange rate for reverse pair of `source` and `target` by `getExchangeRate` method
- Add `isValid` field to `ExchangeRate` type
- Change `getExchangeRate` method to return '0' value for non-valid exchange rate
- Change `Balances` type to store available and on hold balances in new `Balance` type
- Create `BalancesType` type to store available or on hold balances
- Remove `isReturnInNanos` and `isForce` parameters from `getBalances` and `getBalance` methods
- Add `getBalancesAvailable`, `getBalancesOnhold`, `getBalanceAvailable` and `getBalanceOnhold` to get balances by type
- Create `CurrencyCode` type with known variants
- Add `code` field to `Currency` type
- Add `unknown` variant for `CurrencyType`
- Replace `CurrencyType` by enum and store it in `Client` class
- Rename `CurrencyType` to `DetailedCurrencyType` with more detailed variants
- Use `CurrencyType` type to main types variants and store it in `Client` class
- Replace `InvoiceStatus` by enum and store it in `Client` class
- Fix library connection in examples
- Fix links in `readme.md`
- Fix `Client` class `setPageSize` method documentation parameter name
- Fix `ClientEmitter.constructor` documentation inheritance
- Update dependencies

## 0.2.1 - 2024-04-23

- Fix `getInvoices` identifiers parameter name

Thanks:

- [Deyvan](https://github.com/Deyvan)

## 0.2.0 - 2021-12-09

- Using mainnet endpoint for default

## 0.1.1 - 2021-12-05

- Webhooks request data and check signature changes

## 0.1.0 - 2021-12-04

- Change backend API authorization process
- Remove methods, structures and fields related with deleted from backend API methods
- Add webhooks receiving in Node.js with Express.js like middleware support
- Increase Client.createInvoice `payload` field max size
- Add support any type in createInvoice payload and correct parsing in getInvoices response by JSON
- Add direct backend API call method

## 0.0.2 - 2021-11-30

- Increase package version to publish on prereserved npm package name

## 0.0.1 - 2021-11-29

- Initial release