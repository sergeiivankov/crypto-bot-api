const CrypoBotAPI = require('../');

const client = new CrypoBotAPI('1234:AAA...AAA', 'testnet');

client.getMe().then(me => console.log(me));