const CrypoBotAPI = require('crypto-bot-api');

const client = new CrypoBotAPI('1234:AAA...AAA');
client.setPageSize(20);

client.getInvoicesPaginate({ asset: 'BTC', page: 2 }).then(invoices => console.log(invoices));