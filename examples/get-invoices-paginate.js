const CrypoBotAPI = require('../');

const client = new CrypoBotAPI('1234:AAA...AAA');
client.setPageSize(20);

client.getInvoicesPaginate({ currency: 'BTC', page: 2 })
  .then(invoices => {
    console.log(invoices.page)
    console.log(invoices.pagesCount)
    console.log(invoices.items)
  });