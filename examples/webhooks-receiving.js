const { readFileSync } = require('fs');
const CrypoBotAPI = require('crypto-bot-api');

const client = new CrypoBotAPI('1234:AAA...AAA');

const onPaid = (invoice, requestDate) => {
  console.log(requestDate, invoice);
};

// Important: at the time of publication of version 0.3.0 (Sep 16, 2024),
// API servers do not accept self-signed certificates
client.createServer({
  key: readFileSync(__dirname + '/server.key'),
  cert: readFileSync(__dirname + '/server.cert')
}, '/secret-webhooks-path')
  .then(() => client.on('paid', onPaid))
  .catch(err => console.log('Create server error:', err));