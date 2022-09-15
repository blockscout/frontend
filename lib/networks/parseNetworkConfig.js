const supportedNetworks = process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS?.replaceAll('\'', '"');

// should be CommonJS module since it used for next.config.js
function parseNetworkConfig() {
  try {
    return JSON.parse(supportedNetworks || '[]');
  } catch (error) {
    return [];
  }
}

module.exports = parseNetworkConfig;
