import CrypoBotAPI from 'crypto-bot-api';

const client = new CrypoBotAPI('1234:AAA...AAA');
client.setPageSize(20);

const invoices = await client.getInvoicesPaginate({ asset: 'BTC', page: 2 });
console.log(invoices);