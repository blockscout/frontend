async function rewrites() {
  return [
    { source: '/node-api/:slug*', destination: '/api/:slug*' },
  ].filter(Boolean);
}

module.exports = rewrites;
