import CrypoBotAPI, { type CreateInvoiceOptions } from 'crypto-bot-api';

const client = new CrypoBotAPI('1234:AAA...AAA');

// Only required parameters
const minimalOptions: CreateInvoiceOptions = {
  amount: 9.5,
  asset: 'TON'
};
client.createInvoice(minimalOptions).then(invoice => {
  // Send invoice.payUrl to user
  console.log(invoice);
});

// With pay in any support crypto currency using exchange rate passed fiat currency
const fiatOptions: CreateInvoiceOptions = {
  amount: 99,
  currencyType: CrypoBotAPI.CurrencyType.Fiat,
  fiat: 'USD'
}
client.createInvoice(fiatOptions).then(invoice => {
  // Send invoice.payUrl to user
  console.log(invoice);
});

// With pay in passed crypto currencies using exchange rate passed fiat currency
const fiatLimitedOptions: CreateInvoiceOptions = {
  amount: 99,
  currencyType: CrypoBotAPI.CurrencyType.Fiat,
  fiat: 'USD',
  acceptedAssets: ['TON', 'BTC']
};
client.createInvoice(fiatLimitedOptions).then(invoice => {
  // Send invoice.payUrl to user
  console.log(invoice);
});

// With description, payload and anonymous payment disabled
const custom1Options: CreateInvoiceOptions = {
  amount: 9.5,
  asset: 'TON',
  description: 'Pay order in SuperShop',
  isAllowAnonymous: false,
  payload: 'order12345'
};
client.createInvoice(custom1Options).then(invoice => {
  // Send invoice.payUrl to user
  console.log(invoice);
});

// With pay button and payment comment disabled
const custom2Options: CreateInvoiceOptions = {
  amount: 9.5,
  asset: 'TON',
  paidBtnName: 'viewItem',
  paidBtnUrl: 'https://supershop.com/order12345',
  isAllowComments: false,
};
client.createInvoice(custom2Options).then(invoice => {
  // Send invoice.payUrl to user
  console.log(invoice);
});