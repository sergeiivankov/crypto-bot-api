const CrypoBotAPI = require('crypto-bot-api');

const client = new CrypoBotAPI('1234:AAA...AAA');

// Without filters
client.getInvoices()
  .then(invoices => console.log(invoices));

// With filters
client.getInvoices({ asset: 'TON', status: CrypoBotAPI.InvoiceStatus.Active, count: 5 })
  .then(invoices => console.log(invoices));