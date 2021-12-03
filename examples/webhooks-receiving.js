const { readFileSync } = require('fs');
const CrypoBotAPI = require('../lib');

const client = new CrypoBotAPI('1234:AAA...AAA', 'testnet');

const onPaid = (invoice, requestDate) => {
  console.log(requestDate, invoice);
};

// Important: at the time of publication of version 0.1.0 (Dec 4, 2021),
// test API servers do not accept self-signed certificates
client.createServer({
  key: readFileSync(__dirname + '/server.key'),
  cert: readFileSync(__dirname + '/server.cert')
}, {
  port: 443
}, '/secret-webhooks-path')
.then(() => client.on('paid', onPaid))
.catch(err => console.log('Create server error:', err));