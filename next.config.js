const { withSentryConfig } = require('@sentry/nextjs');
const withReactSvg = require('next-react-svg');
const path = require('path');

const headers = require('./configs/nextjs/headers');

const moduleExports = {
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
  headers,
  output: 'standalone',
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withReactSvg(withSentryConfig(moduleExports, sentryWebpackPluginOptions));
