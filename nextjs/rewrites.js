async function rewrites() {
  return [
    { source: '/node-api/proxy/:slug*', destination: '/api/proxy' },
    { source: '/node-api/:slug*', destination: '/api/:slug*' },
    {
      source: '/api/machine',
      destination: 'http://localhost:3001/machine', // 服务器内部后端地址
    },
  ].filter(Boolean);
}

module.exports = rewrites;
