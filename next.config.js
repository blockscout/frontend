const { withSentryConfig } = require('@sentry/nextjs');
const withReactSvg = require('next-react-svg');
const path = require('path');

const headers = require('./configs/nextjs/headers');
const redirects = require('./configs/nextjs/redirects');
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
  // NOTE: all config functions should be static and not depend on any environment variables
  // since all variables will be passed to the app only at runtime and there is now way to change Next.js config at this time
  // if you are stuck and strongly believe what you need some sort of flexibility here please fill free to join the discussion
  // https://github.com/blockscout/frontend/discussions/167
  rewrites,
  redirects,
  headers,
  output: 'standalone',
  sentry: {
    hideSourceMaps: true,
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
