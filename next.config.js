const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZER === 'true',
});

const withRoutes = require('nextjs-routes/config')({
  outDir: 'nextjs',
});

const headers = require('./nextjs/headers');
const redirects = require('./nextjs/redirects');
const rewrites = require('./nextjs/rewrites');

/** @type {import('next').NextConfig} */
const moduleExports = {
  transpilePackages: [
    'react-syntax-highlighter',
    'swagger-client',
    'swagger-ui-react',
  ],
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [ '@svgr/webpack' ],
      },
    );
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

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
  productionBrowserSourceMaps: true,
  experimental: {
    staleTimes: {
      dynamic: 30,
      'static': 180,
    },
  },
};

module.exports = withBundleAnalyzer(withRoutes(moduleExports));
