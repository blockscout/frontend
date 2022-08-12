const withReactSvg = require('next-react-svg');
const path = require('path');

module.exports = withReactSvg({
  target: 'serverless',
  include: path.resolve(__dirname, 'icons'),
  reactStrictMode: true,
  webpack(config) {
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
});
