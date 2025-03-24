import CrypoBotAPI, { InvoiceStatus } from 'crypto-bot-api';

const client = new CrypoBotAPI('1234:AAA...AAA');

// Without filters
const invoices1 = await client.getInvoices();
console.log(invoices1);

// With filters
const invoices2 = await client.getInvoices({
  asset: 'TON',
  status: InvoiceStatus.Active,
  count: 5
});
console.log(invoices2);
