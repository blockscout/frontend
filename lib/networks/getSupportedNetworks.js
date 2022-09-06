function getSupportedNetworks() {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS || '[]');
  } catch (error) {
    return [];
  }
}

module.exports = getSupportedNetworks;
