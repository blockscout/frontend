// eslint-disable-next-line @typescript-eslint/no-var-requires
const withReactSvg = require('next-react-svg');
import path from 'path';

module.exports = withReactSvg({
  include: path.resolve(__dirname, 'icons'),
  reactStrictMode: true,
  webpack(config) {
    return config
  },
})
