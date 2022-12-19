async function rewrites() {
  return [
    { source: '/node-api/:slug*', destination: '/api/:slug*' },
    { source: '/proxy/:slug*', destination: '/api/proxy' },
  ].filter(Boolean);
}

module.exports = rewrites;
