const proxyToTestnet = (cid) => [
  {
    source: '/socket/:path*',
    destination: `https://chain-${ cid }.evm-testnet-blockscout.chainweb.com/socket/:path*`,
  },
  {
    source: '/stats/:path*',
    destination: `https://chain-${ cid }.evm-testnet-blockscout.chainweb.com/stats/:path*`,
  },
  {
    source: '/visualizer/:path*',
    destination: `https://chain-${ cid }.evm-testnet-blockscout.chainweb.com/visualizer/:path*`,
  },
  {
    source: '/api/:path*',
    destination: `https://chain-${ cid }.evm-testnet-blockscout.chainweb.com/api/:path*`,
  },
];

async function rewrites() {
  return [
    { source: '/node-api/proxy/:slug*', destination: '/api/proxy' },
    { source: '/node-api/:slug*', destination: '/api/:slug*' },
    ...(process.env.NODE_ENV === 'development' ? proxyToTestnet(process.env.CHAINWEB_CHAIN_ID) : []),

  ].filter(Boolean);
}

module.exports = rewrites;
