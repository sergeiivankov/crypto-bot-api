import { readFileSync } from 'fs';
import CrypoBotAPI from 'crypto-bot-api';

const client = new CrypoBotAPI('1234:AAA...AAA');

// If you app work behind proxy and no need create HTTPS server,
// no pass `key` and `cert` fields and add `http` field with `true` value:
// { http: true }
//
// Note: if you want to use self-signed certificate
// you must uploat it in CryptoBot API application settings
try {
  await client.createServer({
    key: readFileSync(__dirname + '/server.key'),
    cert: readFileSync(__dirname + '/server.cert')
  }, '/secret-webhooks-path');
} catch (err) {
  console.log('Create server error:', err);
  process.exit();
}

client.on('paid', (invoice, requestDate) => {
  console.log(requestDate, invoice);
});