/* eslint-disable no-console */
const path = require('path');

const stripTrailingSlash = (str) => str[str.length - 1] === '/' ? str.slice(0, -1) : str;

const fetchResource = async(url, formatter) => {
  console.log('🌀 [next-sitemap] Fetching resource:', url);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      console.log('✅ [next-sitemap] Data fetched for resource:', url);
      return formatter(data);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('🚨 [next-sitemap] Request timeout for resource:', url);
    } else {
      console.log('🚨 [next-sitemap] Error fetching resource:', url, error);
    }
  }
};

const siteUrl = [
  process.env.NEXT_PUBLIC_APP_PROTOCOL || 'https',
  '://',
  process.env.NEXT_PUBLIC_APP_HOST,
  process.env.NEXT_PUBLIC_APP_PORT && ':' + process.env.NEXT_PUBLIC_APP_PORT,
].filter(Boolean).join('');

const apiUrl = (() => {
  const baseUrl = [
    process.env.NEXT_PUBLIC_API_PROTOCOL || 'https',
    '://',
    process.env.NEXT_PUBLIC_API_HOST,
    process.env.NEXT_PUBLIC_API_PORT && ':' + process.env.NEXT_PUBLIC_API_PORT,
  ].filter(Boolean).join('');

  const basePath = stripTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_PATH || '');

  return `${ baseUrl }${ basePath }/api/v2`;
})();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateIndexSitemap: false,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/*', '/login', '/chakra', '/sprite', '/account/*'],
      },
    ],
  },
  sourceDir: path.resolve(process.cwd(), '../../../.next'),
  outDir: path.resolve(process.cwd(), '../../../public'),
  exclude: [
    '/account/*',
    '/auth/*',
    '/login',
    '/sprite',
    '/chakra',
  ],
  transform: async(config, path) => {
    switch (path) {
      case '/mud-worlds':
        if (process.env.NEXT_PUBLIC_HAS_MUD_FRAMEWORK !== 'true') {
          return null;
        }
        break;
      case '/batches':
      case '/deposits':
        if (!process.env.NEXT_PUBLIC_ROLLUP_TYPE) {
          return null;
        }
        break;
      case '/withdrawals':
        if (!process.env.NEXT_PUBLIC_ROLLUP_TYPE && process.env.NEXT_PUBLIC_HAS_BEACON_CHAIN !== 'true') {
          return null;
        }
        break;
      case '/dispute-games':
        if (process.env.NEXT_PUBLIC_ROLLUP_TYPE !== 'optimistic') {
          return null;
        }
        break;
      case '/blobs':
        if (process.env.NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED !== 'true') {
          return null;
        }
        break;
      case '/name-domains':
        if (!process.env.NEXT_PUBLIC_NAME_SERVICE_API_HOST) {
          return null;
        }
        break;
      case '/ops':
        if (process.env.NEXT_PUBLIC_HAS_USER_OPS !== 'true') {
          return null;
        }
        break;
      case '/output-roots':
        if (process.env.NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED !== 'true') {
          return null;
        }
        break;
      case '/interop-messages':
        if (process.env.NEXT_PUBLIC_INTEROP_ENABLED !== 'true') {
          return null;
        }
        break;
      case '/pools':
        if (process.env.NEXT_PUBLIC_DEX_POOLS_ENABLED !== 'true') {
          return null;
        }
        break;
      case '/advanced-filter':
        if (process.env.NEXT_PUBLIC_ADVANCED_FILTER_ENABLED === 'false') {
          return null;
        }
        break;
      case '/apps':
        if (process.env.NEXT_PUBLIC_MARKETPLACE_ENABLED !== 'true') {
          return null;
        }
        break;
      case '/api-docs':
        if (process.env.NEXT_PUBLIC_API_SPEC_URL === 'none') {
          return null;
        }
        break;
      case '/gas-tracker':
        if (process.env.NEXT_PUBLIC_GAS_TRACKER_ENABLED === 'false') {
          return null;
        }
        break;
      case '/graphql':
        if (process.env.NEXT_PUBLIC_GRAPHIQL_TRANSACTION === 'none') {
          return null;
        }
        break;
      case '/stats':
        if (!process.env.NEXT_PUBLIC_STATS_API_HOST) {
          return null;
        }
        break;
      case '/validators':
        if (!process.env.NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE) {
          return null;
        }
        break;
    }

    return {
      loc: path,
      changefreq: undefined,
      priority: undefined,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async(config) => {
    const addresses = fetchResource(
      `${ apiUrl }/addresses`,
      (data) => data.items.map(({ hash }) => `/address/${ hash }`),
    );
    const txs = fetchResource(
      `${ apiUrl }/transactions?filter=validated`,
      (data) => data.items.map(({ hash }) => `/tx/${ hash }`),
    );
    const blocks = fetchResource(
      `${ apiUrl }/blocks?type=block`,
      (data) => data.items.map(({ height }) => `/block/${ height }`),
    );
    const tokens = fetchResource(
      `${ apiUrl }/tokens`,
      (data) => data.items.map(({ address }) => `/token/${ address }`),
    );
    const contracts = fetchResource(
      `${ apiUrl }/smart-contracts`,
      (data) => data.items.map(({ address }) => `/address/${ address.hash }?tab=contract`),
    );

    return Promise.all([
      ...(await addresses || []),
      ...(await txs || []),
      ...(await blocks || []),
      ...(await tokens || []),
      ...(await contracts || []),
    ].map(path => config.transform(config, path)));
  },
};
