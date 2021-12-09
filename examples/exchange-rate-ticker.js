const CrypoBotAPI = require('../');

const client = new CrypoBotAPI('1234:AAA...AAA');

const tick = async () => {
  setTimeout(tick, 15000);

  // Get exchange rate with isForce parameter, beause example update
  // interval (15s) less than library exchange rates cache
  // interval (60s)
  const rate = await client.getExchangeRate('TON', 'USD', true);
  console.log('TON to USD', rate);
};

tick();