# Crypto Bot API

Simple and minimalistic client for [CryptoBot](https://t.me/CryptoBot) API made with love and TypeScript.

## Installing

Using npm/yarn:
```bash
$ npm install crypto-bot-api
```

```bash
$ yarn add crypto-bot-api
```

For browsers use bundles from `dist` directory or add package to your project dependencies and import to add library to your app bundle.

Minified version `crypto-bot-api.min.js` size only 2.9kb Gzipped.

## Supported environments

- \>= Node.js 12
- \>= Chrome 32
- \>= Firefox 29
- \>= Edge 12
- \>= Safari 8
- \>= Safari on iOS 8
- \> Android Browser 4.4.4

## Usage

In Node.js:

```javascript
const CryptoBotAPI = require('crypto-bot-api');

const client = new CryptoBotAPI('1234:AAA...AAA', 'testnet');

const me = await client.getMe();
console.log(me);
```

In browsers:

```html
<script src="crypto-bot-api.min.js"></script>
<script>
  var client = new CryptoBotAPI('1234:AAA...AAA', 'testnet');

  client.getMe().then(function(me) {
    console.log(me);
  });
</script>
```

**Important: at the time of publication of version 0.0.1 (Nov 29, 2021), test API servers do not return header Access-Control-Allow-Origin, which allows make requests to API from third-party domains, so client request from website environment won't work (but its work in browser extensions, Electron and similar apps)**

More usage examples see in [examples](https://github.com/sergeiivankov/crypto-bot-api/tree/main/examples) project directory.

## Documentation

Library documentation can be found in [repository GitHub page](https://sergeiivankov.github.io/cryto-bot-api/). We advise you to start studying documentation with library default exported [Client class](https://sergeiivankov.github.io/cryto-bot-api/classes/Client.html).

## Building

Files for Node.js compiled to `lib` directory.

Browsers bundles compiled to `dist` directory.

```bash
$ git clone https://github.com/sergeiivankov/crypto-bot-api
$ cd crypto-bot-api
$ npm i
$ npm run build-docs # To build library documentation
$ npm run build-lib # To build for Node.js
$ npm run build-dist # To build for Browsers
$ npm run build # To build both
```

Also, project have `watch` commands to using it in development:
```bash
$ npm run watch-docs
$ npm run watch-lib
$ npm run watch-dist
```

## Resources

* [Examples](https://github.com/sergeiivankov/crypto-bot-api/tree/main/examples)
* [Changelog](https://github.com/sergeiivankov/crypto-bot-api/blob/main/CHANGELOG.md)
* [Backend CryptoBot API description](https://telegra.ph/Crypto-Pay-API-11-25)

## Code quality

To maintain high quality of the code and bring source code to a consistent form, project use `eslint` linter and has high documentation requirements. If you want to make a pull request, check that documentation matches your changes and `eslint` does not signal errors with command:

```bash
$ npm run lint
```
