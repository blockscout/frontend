const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZER === 'true',
});

// Destination of the generated nextjs-routes.d.ts. It has to be passed to nextjs-routes twice:
// the webpack plugin below takes it as an option, while the CLI (pnpm routes:generate) only reads
// it off the resolved Next.js config, hence the `outDir` key at the bottom of moduleExports.
const ROUTES_OUT_DIR = 'src/shared/router';

const withRoutes = require('nextjs-routes/config')({
  outDir: ROUTES_OUT_DIR,
});

const headers = require('./src/server/headers');
const redirects = require('./src/server/redirects');
const rewrites = require('./src/server/rewrites');

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
      fs: { browser: './src/server/empty-module.js' },
      net: { browser: './src/server/empty-module.js' },
      tls: { browser: './src/server/empty-module.js' },
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
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      // @metamask/sdk (reached via @wagmi/connectors -> @reown/appkit-adapter-wagmi) imports the
      // React Native storage adapter unconditionally. It is an optional peer dep of a code path a
      // browser bundle never takes, so resolve it to an empty module instead of letting webpack
      // warn about it on every production build.
      '@react-native-async-storage/async-storage': false,
    };
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
  // Turbopack's standalone tracer copies only @swc/helpers/cjs and drops the esm/ entry points that
  // Next's require-hook loads at runtime, so `node server.js` crashes on boot. Force the whole
  // package into the standalone bundle until the tracer is fixed upstream.
  outputFileTracingIncludes: {
    '/**': [ './node_modules/@swc/helpers/**' ],
  },
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
    // Next 16.3 defaults build-time type-checking to the `tsc` CLI, which requires a
    // `typescript/bin/tsc` binary. This repo runs the native TypeScript compiler via the
    // `@typescript/typescript6` alias, which ships `bin/tsc6` only — so the CLI path reports
    // `typescript` as missing and aborts the build. The compiler-API path checks against
    // `lib/typescript.js`, which the alias does provide, so type-checking runs normally.
    useTypeScriptCli: false,
  },


  // workaround for passing outDir to nextjs-routes CLI, see ROUTES_OUT_DIR above.
  // Next.js warns about this unrecognized key on startup; the warning is harmless.
  outDir: ROUTES_OUT_DIR,
};

module.exports = withBundleAnalyzer(withRoutes(moduleExports));
