const withReactSvg = require('next-react-svg');
const path = require('path');

module.exports = withReactSvg({
  include: path.resolve(__dirname, 'icons'),
  reactStrictMode: true,
  webpack(config) {
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/xdai/testnet',
        permanent: true,
      },
    ];
  },
  output: 'standalone',
});
