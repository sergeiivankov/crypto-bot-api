const CrypoBotAPI = require('crypto-bot-api');

const client = new CrypoBotAPI('1234:AAA...AAA');

// Only required parameters
client.createInvoice({
  amount: 9.5,
  asset: 'TON'
}).then(invoice => {
  // Send invoice.payUrl to user

  console.log(invoice);
});

// With pay in any support crypto currency using exchange rate passed fiat currency
client.createInvoice({
  amount: 99,
  currencyType: CrypoBotAPI.CurrencyType.Fiat,
  fiat: 'USD'
}).then(invoice => {
  // Send invoice.payUrl to user

  console.log(invoice);
});

// With pay in passed crypto currencies using exchange rate passed fiat currency
client.createInvoice({
  amount: 99,
  currencyType: CrypoBotAPI.CurrencyType.Fiat,
  fiat: 'USD',
  acceptedAssets: ['TON', 'BTC']
}).then(invoice => {
  // Send invoice.payUrl to user

  console.log(invoice);
});

// With description, payload and anonymous payment disabled
client.createInvoice({
  amount: 9.5,
  asset: 'TON',
  description: 'Pay order in SuperShop',
  isAllowAnonymous: false,
  payload: 'order12345'
}).then(invoice => {
  // Send invoice.payUrl to user

  console.log(invoice);
});

// With pay button and payment comment disabled
client.createInvoice({
  amount: 9.5,
  asset: 'TON',
  paidBtnName: 'viewItem',
  paidBtnUrl: 'https://supershop.com/order12345',
  isAllowComments: false,
}).then(invoice => {
  // Send invoice.payUrl to user

  console.log(invoice);
});