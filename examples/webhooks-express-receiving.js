const { readFileSync } = require('fs');
const { createServer } = require('https');
const express = require('express');
const CrypoBotAPI = require('../lib');

const app = express();
const client = new CrypoBotAPI('1234:AAA...AAA');

client.on('paid', (invoice, requestDate) => {
  console.log(requestDate, invoice);
});

app.use('/secret', client.middleware());

// Important: at the time of publication of version 0.2.0 (Dec 9, 2021),
// API servers do not accept self-signed certificates
createServer({
  key: readFileSync('/etc/letsencrypt/live/studiot.ru/privkey.pem'),
  cert: readFileSync('/etc/letsencrypt/live/studiot.ru/fullchain.pem')
}, app).listen(443);