const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZER === 'true',
});
const withRoutes = require('nextjs-routes/config')({
  outDir: 'nextjs',
});

const headers = require('./nextjs/headers');
const redirects = require('./nextjs/redirects');
const rewrites = require('./nextjs/rewrites');
const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const moduleExports = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  i18n,
  transpilePackages: ['react-syntax-highlighter', 'swagger-client', 'swagger-ui-react'],
  reactStrictMode: true,
  // webpack(config, { webpack }) {
  //   config.plugins.push(
  //     new webpack.DefinePlugin({
  //       __SENTRY_DEBUG__: false,
  //       __SENTRY_TRACING__: false,
  //     })
  //   );
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ['@svgr/webpack'],
  //   });
  //   config.resolve.fallback = { fs: false, net: false, tls: false };
  //   config.externals.push('pino-pretty', 'lokijs', 'encoding');

  //   return config;
  // },
  webpack(config, { isServer, webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      })
    );
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    if (!isServer) {
      config.module.noParse = config.module.noParse || [];
      config.module.noParse.push(/node:/); // 忽略 node: 前缀
      // 针对 i18next-fs-backend 的额外屏蔽
      config.module.rules.unshift({
        test: /i18next-fs-backend/,
        loader: 'ignore-loader', // 使用 ignore-loader
      });
    }
    console.log('3336666');
    return config;
  },
  rewrites,
  redirects,
  headers,
  output: 'standalone',
  productionBrowserSourceMaps: true,
  experimental: {
    instrumentationHook: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

module.exports = withBundleAnalyzer(withRoutes(moduleExports));
