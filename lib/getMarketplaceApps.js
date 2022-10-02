// should be CommonJS module since it used for next.config.js
const data = require('../data/marketplaceApps.json');

function getMarketplaceApps() {
  return data;
}

module.exports = getMarketplaceApps;
