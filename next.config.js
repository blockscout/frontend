const { withSentryConfig } = require('@sentry/nextjs');
const withReactSvg = require('next-react-svg');
const path = require('path');

const headers = require('./configs/nextjs/headers');
const rewrites = require('./configs/nextjs/rewrites');

const moduleExports = {
  include: path.resolve(__dirname, 'icons'),
  reactStrictMode: true,
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    );

    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/poa/core',
        permanent: false,
      },
    ];
  },
  headers,
  rewrites,
  output: 'standalone',
  sentry: {
    hideSourceMaps: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_SUPPORTED_NETWORKS: process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS,
  },
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
  deploy: {
    env: process.env.VERCEL_ENV || process.env.NODE_ENV,
  },
};

module.exports = withReactSvg(withSentryConfig(moduleExports, sentryWebpackPluginOptions));
