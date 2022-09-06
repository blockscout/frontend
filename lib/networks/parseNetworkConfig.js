// should be CommonJS module since it used for next.config.js
function parseNetworkConfig() {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS || '[]');
  } catch (error) {
    return [];
  }
}

module.exports = parseNetworkConfig;
