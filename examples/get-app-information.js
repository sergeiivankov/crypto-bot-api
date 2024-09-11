const CrypoBotAPI = require('crypto-bot-api');

const client = new CrypoBotAPI('1234:AAA...AAA');

client.getMe().then(me => console.log(me));