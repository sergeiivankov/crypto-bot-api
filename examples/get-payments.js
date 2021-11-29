const CrypoBotAPI = require('../');

const client = new CrypoBotAPI('1234:AAA...AAA', 'testnet');

// Without filters
client.getPayments()
  .then(payments => console.log(payments));

// With filters
client.getPayments({ count: 5, offset: 10 })
  .then(payments => console.log(payments));