const { withSentryConfig } = require('@sentry/nextjs');
const withReactSvg = require('next-react-svg');
const path = require('path');

const headers = require('./configs/nextjs/headers');

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
        destination: '/xdai/testnet',
        permanent: true,
      },
    ];
  },
  headers,
  async rewrites() {
    // there can be networks without subtype
    // routing in nextjs allows optional params only at the end of the path
    // if there are paths with subtype and subsubtype, we will change the routing
    // but so far we think we're ok with this hack
    const NETWORKS = JSON.parse(process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS);
    return NETWORKS.filter(n => !n.subType).map(n => ({
      source: `/${ n.type }/:slug*`,
      destination: `/${ n.type }/mainnet/:slug*`,
    }));
  },
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
  deploy: {
    env: process.env.VERCEL_ENV || process.env.NODE_ENV,
  },
};

module.exports = withReactSvg(withSentryConfig(moduleExports, sentryWebpackPluginOptions));
