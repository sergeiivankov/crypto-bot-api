const CrypoBotAPI = require('../');

const client = new CrypoBotAPI('1234:AAA...AAA', 'testnet');

// Without filters
client.getInvoices({ status: 'paid' })
  .then(invoices => {
    const promises = [];

    invoices.items.forEach(invoice => {
      // Make some work with invoice.payload field

      promises.push(client.confirmPayment(invoice.id));
    });

    return Promise.all(promises);
  })
  .then(confirmedInvoices => {
    console.log(confirmedInvoices);
  });