const featuredNetworks = process.env.NEXT_PUBLIC_FEATURED_NETWORKS?.replaceAll('\'', '"');

// should be CommonJS module since it used for next.config.js
function parseNetworkConfig() {
  try {
    return JSON.parse(featuredNetworks || '[]');
  } catch (error) {
    return [];
  }
}

module.exports = parseNetworkConfig;
