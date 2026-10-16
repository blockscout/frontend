const path = require('path');

const stripTrailingSlash = (str) => str[str.length - 1] === '/' ? str.slice(0, -1) : str;

const isEnvTrue = (name) => process.env[name] === 'true';
const isEnvFalse = (name) => process.env[name] === 'false';
const isEnvSet = (name) => Boolean(process.env[name]);

const isRollup = () => isEnvSet('NEXT_PUBLIC_ROLLUP_TYPE');
const isMultichain = () => isEnvTrue('NEXT_PUBLIC_MULTICHAIN_ENABLED');
const hasBeaconDeposits = () => isEnvTrue('NEXT_PUBLIC_HAS_BEACON_CHAIN') && !isEnvTrue('NEXT_PUBLIC_BEACON_CHAIN_WITHDRAWALS_ONLY');

// A route is left out of the sitemap when its predicate holds for the instance's env.
const HIDDEN_ROUTES = new Map(Object.entries({
  '/batches': () => !isRollup() && !hasBeaconDeposits(),
  '/deposits': () => !isRollup() && !hasBeaconDeposits(),
  '/withdrawals': () => !isRollup() && !isEnvTrue('NEXT_PUBLIC_HAS_BEACON_CHAIN'),
  '/dispute-games': () => process.env.NEXT_PUBLIC_ROLLUP_TYPE !== 'optimistic',
  '/blobs': () => !isEnvTrue('NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED'),
  '/name-services': () => !isEnvSet('NEXT_PUBLIC_NAME_SERVICE_API_HOST') || !isEnvSet('NEXT_PUBLIC_CLUSTERS_API_HOST'),
  '/ops': () => !isEnvTrue('NEXT_PUBLIC_HAS_USER_OPS'),
  '/output-roots': () => !isEnvTrue('NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED'),
  '/interop-messages': () => !isEnvTrue('NEXT_PUBLIC_INTEROP_ENABLED'),
  '/pools': () => !isEnvTrue('NEXT_PUBLIC_DEX_POOLS_ENABLED'),
  '/advanced-filter': () => isEnvFalse('NEXT_PUBLIC_ADVANCED_FILTER_ENABLED'),
  '/apps': () => !isEnvTrue('NEXT_PUBLIC_MARKETPLACE_ENABLED'),
  // on chains served by the Pro API the page only exists when tabs are configured explicitly
  '/api-docs': () => process.env.NEXT_PUBLIC_API_DOCS_TABS === '[]' ||
    (isEnvTrue('NEXT_PUBLIC_PRO_API_SUPPORTED') && !isEnvSet('NEXT_PUBLIC_API_DOCS_TABS')),
  '/gas-tracker': () => isEnvFalse('NEXT_PUBLIC_GAS_TRACKER_ENABLED'),
  '/stats': () => !isEnvSet('NEXT_PUBLIC_STATS_API_HOST'),
  '/uptime': () => !isEnvSet('NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS'),
  '/validators': () => !isEnvSet('NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE'),
  '/epochs': () => !isEnvTrue('NEXT_PUBLIC_CELO_ENABLED'),
  '/operations': () => !isEnvSet('NEXT_PUBLIC_TAC_OPERATION_LIFECYCLE_API_HOST'),
  '/public-tags/submit': () => !isEnvSet('NEXT_PUBLIC_ADMIN_SERVICE_API_HOST') || !isEnvSet('NEXT_PUBLIC_METADATA_SERVICE_API_HOST'),
  '/txn-withdrawals': () => process.env.NEXT_PUBLIC_ROLLUP_TYPE !== 'arbitrum',
  '/hot-contracts': () => !isEnvTrue('NEXT_PUBLIC_HOT_CONTRACTS_ENABLED'),
  '/block/countdown': isMultichain,
  '/contract-verification': isMultichain,
  '/visualize/sol2uml': isMultichain,
}));

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

const fetchDapps = async() => {
  if (process.env.NEXT_PUBLIC_MARKETPLACE_ENABLED !== 'true') {
    return;
  }

  const formatter = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .sort((a, b) => {
        const priorityA = a.priority || 0;
        const priorityB = b.priority || 0;
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        if (a.internalWallet !== b.internalWallet) {
          return a.internalWallet ? -1 : 1;
        }
        if (a.external !== b.external) {
          return a.external ? 1 : -1;
        }
        return 0;
      })
      .slice(0, 50)
      .map(({ id }) => ({ path: `/apps/${ id }/info` }));
  };

  const configUrl = process.env.NEXT_PUBLIC_MARKETPLACE_CONFIG_URL;
  if (configUrl) {
    return fetchResource(configUrl, formatter);
  }

  const api = process.env.NEXT_PUBLIC_ADMIN_SERVICE_API_HOST;
  const instanceId = process.env.NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID || process.env.NEXT_PUBLIC_NETWORK_ID;
  if (api && instanceId) {
    return fetchResource(`${ stripTrailingSlash(api) }/api/v1/chains/${ instanceId }/marketplace/dapps`, formatter);
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

const statsApiUrl = (() => {
  const baseUrl = process.env.NEXT_PUBLIC_STATS_API_HOST;
  if (!baseUrl) {
    return;
  }

  const basePath = stripTrailingSlash(process.env.NEXT_PUBLIC_STATS_API_BASE_PATH || '');

  return `${ stripTrailingSlash(baseUrl) }${ basePath }/api/v1`;
})();

const fetchStatsCharts = async() => {
  if (!statsApiUrl) {
    return;
  }

  return fetchResource(
    `${ statsApiUrl }/lines`,
    (data) => (data.sections || []).flatMap(
      (section) => (section.charts || []).map(({ id }) => ({ path: `/stats/${ id }` })),
    ),
  );
};

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
        disallow: [ '/auth/*', '/login', '/chakra', '/sprite', '/account/*' ],
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
  transform: async({ lastmod, ...config }, path) => {
    if (HIDDEN_ROUTES.get(path)?.()) {
      return null;
    }

    return {
      loc: path,
      changefreq: undefined,
      priority: undefined,
      lastmod: lastmod ?? (config.autoLastmod ? new Date().toISOString() : undefined),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async(config) => {
    if (isMultichain()) {
      return;
    }

    const addresses = fetchResource(
      `${ apiUrl }/addresses`,
      (data) => data.items.map(({ hash }) => ({
        path: `/address/${ hash }`,
      })),
    );
    const txs = fetchResource(
      `${ apiUrl }/transactions?filter=validated`,
      (data) => data.items.map(({ hash, timestamp }) => ({
        path: `/tx/${ hash }`,
        lastmod: timestamp,
      })),
    );
    const blocks = fetchResource(
      `${ apiUrl }/blocks?type=block`,
      (data) => data.items.map(({ height, timestamp }) => ({
        path: `/block/${ height }`,
        lastmod: timestamp,
      })),
    );
    const tokens = fetchResource(
      `${ apiUrl }/tokens`,
      (data) => data.items.map(({ address_hash: addressHash }) => ({
        path: `/token/${ addressHash }`,
      })),
    );
    const contracts = isEnvTrue('NEXT_PUBLIC_HOT_CONTRACTS_ENABLED') ?
      fetchResource(
        `${ apiUrl }/stats/hot-smart-contracts?scale=30d`,
        (data) => data.items.map(({ contract_address: contractAddress }) => ({
          path: `/address/${ contractAddress.hash }?tab=contract`,
        })),
      ) :
      fetchResource(
        `${ apiUrl }/smart-contracts`,
        (data) => data.items.map(({ address }) => ({
          path: `/address/${ address.hash }?tab=contract`,
        })),
      );
    const dapps = fetchDapps();
    const statsCharts = fetchStatsCharts();

    const paths = (await Promise.all([ addresses, txs, blocks, tokens, contracts, dapps, statsCharts ]))
      .flatMap((items) => items || []);

    return Promise.all(paths.map(({ path, lastmod }) => config.transform({ ...config, lastmod }, path)));
  },
};
