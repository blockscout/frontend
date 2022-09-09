const parseNetworkConfig = require('../../lib/networks/parseNetworkConfig');

async function rewrites() {
  // there can be networks without subtype
  // routing in nextjs allows optional params only at the end of the path
  // if there are paths with subtype and subsubtype, we will change the routing
  // but so far we think we're ok with this hack
  const networksFromConfig = parseNetworkConfig();
  return networksFromConfig.filter(n => !n.subType).map(n => ({
    source: `/${ n.type }/:slug*`,
    destination: `/${ n.type }/mainnet/:slug*`,
  }));
}

module.exports = rewrites;
