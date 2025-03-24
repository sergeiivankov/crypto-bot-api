import CrypoBotAPI from 'crypto-bot-api';

const client = new CrypoBotAPI('1234:AAA...AAA');

const me = await client.getMe();
console.log(me)