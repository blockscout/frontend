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
  ],
  reactStrictMode: true,
  // Turbopack config (Next.js 16 default bundler) – mirrors webpack customizations below
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [ '@svgr/webpack' ],
        as: '*.js',
      },
    },
    // Stub Node built-ins only in browser bundles; Node (SSR, instrumentation) keeps real modules
    resolveAlias: {
      fs: { browser: './nextjs/empty-module.js' },
      net: { browser: './nextjs/empty-module.js' },
      tls: { browser: './nextjs/empty-module.js' },
    },
  },
  // Used when BUNDLE_ANALYZER=true (run: next build --webpack) or for custom webpack tooling
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [ '@svgr/webpack' ],
      },
    );
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // Tell webpack the target supports async/await so it stops warning about top-level await
    // Top-level await is belong to ES2017 specification that is adopted by all major browsers and Node.js.
    config.output.environment = {
      ...config.output.environment,
      asyncFunction: true,
    };

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
  productionBrowserSourceMaps: false,
  serverExternalPackages: [
    '@opentelemetry/sdk-node',
    '@opentelemetry/auto-instrumentations-node',
    'pino-pretty',
    'lokijs',
    'encoding',
  ],
  experimental: {
    staleTimes: {
      dynamic: 30,
      'static': 180,
    },
  },
  generateBuildId: async () => {
    return process.env.NEXT_BUILD_ID || Date.now().toString(36) + Math.random().toString(36).substring(2);
  },
};

module.exports = withBundleAnalyzer(withRoutes(moduleExports));
