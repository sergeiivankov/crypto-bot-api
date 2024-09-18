# Crypto Bot API - client library for Crypto Pay API

Written in TypeScript up-to-date client library for Crypto Pay API provided by Telegram [CryptoBot](https://t.me/CryptoBot).

## Installing

Using npm/yarn:
```bash
$ npm install crypto-bot-api
```

```bash
$ yarn add crypto-bot-api
```

For browsers use bundles from `dist` directory or add package to your project dependencies and import it.

## Usage

In Node.js:

```javascript
const CryptoBotAPI = require('crypto-bot-api');

const client = new CryptoBotAPI('1234:AAA...AAA');

const me = await client.getMe();
console.log(me);
```

In browsers:

```html
<script src="crypto-bot-api.min.js"></script>
<script>
  var client = new CryptoBotAPI('1234:AAA...AAA');

  client.getMe().then(function(me) {
    console.log(me);
  });
</script>
```

**Important: at the time of publication of version 0.3.3 (Sep 18, 2024), API servers do not return header Access-Control-Allow-Origin, which allows make requests to API from third-party domains, so client request from website environment won't work (but its work in browser extensions, Electron and similar apps)**

More usage examples see in [examples](https://github.com/sergeiivankov/crypto-bot-api/tree/main/examples) project directory.

## Receiving updates

Crypto Pay API support events by sending webhooks requests. To handle webhooks request library proposes to use [creating Node.js built-in HTTP or HTTPS server](https://sergeiivankov.github.io/crypto-bot-api/classes/ClientEmitter.html#createServer) or [using Express.js-like middleware API](https://sergeiivankov.github.io/crypto-bot-api/classes/ClientEmitter.html#middleware). See [examples](https://github.com/sergeiivankov/crypto-bot-api/tree/main/examples) with names starts with `webhooks-`.

*Note: you need enable webhooks in CryptoBot app settings, if you want to use self-signed certificate you must uploat it in CryptoBot API application settings*

## Documentation

Library documentation can be found in [repository GitHub page](https://sergeiivankov.github.io/crypto-bot-api/).

For Node.js usage, we advise you to start studying documentation with library default exported [ClientEmitter class](https://sergeiivankov.github.io/crypto-bot-api/classes/ClientEmitter.html).

For browsers usage, we advise you to start studying documentation with library default exported for browsers [Client class](https://sergeiivankov.github.io/crypto-bot-api/classes/Client.html).

## Building

Files for Node.js compiled to `lib` directory. Browsers bundles compiled to `dist` directory.

```bash
$ git clone https://github.com/sergeiivankov/crypto-bot-api
$ cd crypto-bot-api
$ npm i
$ npm run build-docs # To build library documentation
$ npm run build-lib # To build for Node.js
$ npm run build-dist # To build for Browsers
$ npm run build # To build all
```

Also, project have `watch` commands to using it in development:
```bash
$ npm run watch-docs # To watch build library documentation
$ npm run watch-lib # To watch build for Node.js
$ npm run watch-dist # To watch build for Browsers
$ npm run watch # To watch all
```

## Resources

* [Documentation](https://sergeiivankov.github.io/crypto-bot-api/)
* [Examples](https://github.com/sergeiivankov/crypto-bot-api/tree/main/examples)
* [Changelog](https://github.com/sergeiivankov/crypto-bot-api/blob/main/changelog.md)
* [Backend CryptoBot API description](https://help.crypt.bot/crypto-pay-api)

## Code quality

To maintain high quality of the code and bring source code to a consistent form, project use `eslint` linter and has high documentation requirements. If you want to make a pull request, check that documentation matches your changes and `eslint` does not signal errors with command:

```bash
$ npm run lint
```

## Supported environments

- \>= Node.js 12
- \>= Chrome 32
- \>= Firefox 29
- \>= Edge 12
- \>= Safari 8
- \>= Safari on iOS 8
- \> Android Browser 4.4.4

## License

[MIT](https://github.com/sergeiivankov/crypto-bot-api/blob/main/license)