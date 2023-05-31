const withTM = require('next-transpile-modules')([
  'react-syntax-highlighter',
  'swagger-client',
  'swagger-ui-react',
]);
const withRoutes = require('nextjs-routes/config')({
  outDir: 'types',
});
const path = require('path');

const headers = require('./configs/nextjs/headers');
const redirects = require('./configs/nextjs/redirects');
const rewrites = require('./configs/nextjs/rewrites');

const moduleExports = withTM({
  include: path.resolve(__dirname, 'icons'),
  reactStrictMode: true,
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    );
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [ '@svgr/webpack' ],
      },
    );
    config.resolve.fallback = { fs: false, net: false, tls: false };

    return config;
  },
  // NOTE: all config functions should be static and not depend on any environment variables
  // since all variables will be passed to the app only at runtime and there is now way to change Next.js config at this time
  // if you are stuck and strongly believe what you need some sort of flexibility here please fill free to join the discussion
  // https://github.com/blockscout/frontend/discussions/167
  rewrites,
  redirects,
  headers,
  output: 'standalone',
  api: {
    // disable body parser since we use next.js api only for local development and as a proxy
    // otherwise it is impossible to upload large files (over 1Mb)
    bodyParser: false,
  },
});

module.exports = withRoutes(moduleExports);
