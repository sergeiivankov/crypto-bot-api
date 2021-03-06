const CrypoBotAPI = require('../');

const client = new CrypoBotAPI('1234:AAA...AAA');

// Without filters
client.getInvoices()
  .then(invoices => console.log(invoices));

// With filters
client.getInvoices({ currency: 'TON', status: 'active', count: 5 })
  .then(invoices => console.log(invoices));