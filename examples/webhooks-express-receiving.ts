import { readFileSync } from 'fs';
import { createServer } from 'https';
// @ts-ignore
import express from 'express';
import CrypoBotAPI from 'crypto-bot-api';

const app = express();
const client = new CrypoBotAPI('1234:AAA...AAA');

client.on('paid', (invoice, requestDate) => {
  console.log(requestDate, invoice);
});

app.use('/secret-webhooks-path', client.middleware());

// Note: if you want to use self-signed certificate
// you must uploat it in CryptoBot API application settings
createServer({
  key: readFileSync(__dirname + '/server.key'),
  cert: readFileSync(__dirname + '/server.cert')
}, app).listen(443);