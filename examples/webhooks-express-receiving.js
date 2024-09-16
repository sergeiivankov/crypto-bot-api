const { readFileSync } = require('fs');
const { createServer } = require('https');
const express = require('express');
const CrypoBotAPI = require('crypto-bot-api');

const app = express();
const client = new CrypoBotAPI('1234:AAA...AAA');

client.on('paid', (invoice, requestDate) => {
  console.log(requestDate, invoice);
});

app.use('/secret', client.middleware());

// Important: at the time of publication of version 0.3.0 (Sep 16, 2024),
// API servers do not accept self-signed certificates
createServer({
  key: readFileSync(__dirname + '/server.key'),
  cert: readFileSync(__dirname + '/server.cert')
}, app).listen(443);