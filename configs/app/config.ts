/* eslint-disable no-restricted-properties */
import type { AppItemOverview } from 'types/client/apps';
import type { FeaturedNetwork, NetworkExplorer, PreDefinedNetwork } from 'types/networks';
import type { ChainIndicatorId } from 'ui/home/indicators/types';

const getEnvValue = (env: string | undefined) => env?.replaceAll('\'', '"');
const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null') as DataType | null;
  } catch (error) {
    return null;
  }
};
const stripTrailingSlash = (str: string) => str[str.length - 1] === '/' ? str.slice(0, -1) : str;

const env = process.env.NODE_ENV;
const isDev = env === 'development';

const appPort = getEnvValue(process.env.NEXT_PUBLIC_APP_PORT);
const appSchema = getEnvValue(process.env.NEXT_PUBLIC_APP_PROTOCOL);
const appHost = getEnvValue(process.env.NEXT_PUBLIC_APP_HOST);
const baseUrl = [
  appSchema || 'https',
  '://',
  appHost,
  appPort && ':' + appPort,
].filter(Boolean).join('');
const authUrl = getEnvValue(process.env.NEXT_PUBLIC_AUTH_URL) || baseUrl;
const apiHost = getEnvValue(process.env.NEXT_PUBLIC_API_HOST);
const apiSchema = getEnvValue(process.env.NEXT_PUBLIC_API_PROTOCOL) || 'https';
const apiPort = getEnvValue(process.env.NEXT_PUBLIC_API_PORT);
const apiEndpoint = apiHost ? [
  apiSchema || 'https',
  '://',
  apiHost,
  apiPort && ':' + apiPort,
].filter(Boolean).join('') : 'https://blockscout.com';

const logoutUrl = (() => {
  try {
    const envUrl = getEnvValue(process.env.NEXT_PUBLIC_LOGOUT_URL);
    const auth0ClientId = getEnvValue(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID);
    const returnUrl = getEnvValue(process.env.NEXT_PUBLIC_LOGOUT_RETURN_URL);
    if (!envUrl || !auth0ClientId || !returnUrl) {
      throw Error();
    }

    const url = new URL(envUrl);
    url.searchParams.set('client_id', auth0ClientId);
    url.searchParams.set('returnTo', returnUrl);
    return url.toString();
  } catch (error) {
    return;
  }
})();

const DEFAULT_CURRENCY_DECIMALS = 18;

const config = Object.freeze({
  env,
  isDev,
  network: {
    type: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_TYPE) as PreDefinedNetwork | undefined,
    logo: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_LOGO),
    smallLogo: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_SMALL_LOGO),
    name: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_NAME),
    id: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ID),
    shortName: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_SHORT_NAME),
    currency: {
      name: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_NAME),
      symbol: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL),
      decimals: Number(getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS)) || DEFAULT_CURRENCY_DECIMALS,
      address: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS),
    },
    assetsPathname: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ASSETS_PATHNAME),
    explorers: parseEnvJson<Array<NetworkExplorer>>(getEnvValue(process.env.NEXT_PUBLIC_NETWORK_EXPLORERS)) || [],
    verificationType: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE) || 'mining',
    rpcUrl: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_RPC_URL),
    isTestnet: getEnvValue(process.env.NEXT_PUBLIC_IS_TESTNET) === 'true',
  },
  footerLinks: {
    github: getEnvValue(process.env.NEXT_PUBLIC_FOOTER_GITHUB_LINK),
    twitter: getEnvValue(process.env.NEXT_PUBLIC_FOOTER_TWITTER_LINK),
    telegram: getEnvValue(process.env.NEXT_PUBLIC_FOOTER_TELEGRAM_LINK),
    staking: getEnvValue(process.env.NEXT_PUBLIC_FOOTER_STAKING_LINK),
  },
  featuredNetworks: parseEnvJson<Array<FeaturedNetwork>>(getEnvValue(process.env.NEXT_PUBLIC_FEATURED_NETWORKS)) || [],
  blockScoutVersion: getEnvValue(process.env.NEXT_PUBLIC_BLOCKSCOUT_VERSION),
  isAccountSupported: getEnvValue(process.env.NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED) === 'true',
  marketplaceAppList: parseEnvJson<Array<AppItemOverview>>(getEnvValue(process.env.NEXT_PUBLIC_MARKETPLACE_APP_LIST)) || [],
  marketplaceSubmitForm: getEnvValue(process.env.NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM),
  protocol: appSchema,
  host: appHost,
  port: appPort,
  baseUrl,
  authUrl,
  logoutUrl,
  isL2Network: getEnvValue(process.env.NEXT_PUBLIC_IS_L2_NETWORK) === 'true',
  l1BaseUrl: getEnvValue(process.env.NEXT_PUBLIC_L1_BASE_URL),
  ad: {
    domainWithAd: getEnvValue(process.env.NEXT_PUBLIC_AD_DOMAIN_WITH_AD) || 'blockscout.com',
    adButlerOn: getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_ON) === 'true',
  },
  api: {
    host: apiHost,
    endpoint: apiEndpoint,
    socket: apiHost ? `wss://${ apiHost }` : 'wss://blockscout.com',
    basePath: stripTrailingSlash(getEnvValue(process.env.NEXT_PUBLIC_API_BASE_PATH) || ''),
  },
  L2: {
    isL2Network: getEnvValue(process.env.NEXT_PUBLIC_IS_L2_NETWORK) === 'true',
    L1BaseUrl: getEnvValue(process.env.NEXT_PUBLIC_L1_BASE_URL),
    withdrawalUrl: getEnvValue(process.env.NEXT_PUBLIC_L2_WITHDRAWAL_URL) || '',
  },
  statsApi: {
    endpoint: getEnvValue(process.env.NEXT_PUBLIC_STATS_API_HOST),
    basePath: '',
  },
  visualizeApi: {
    endpoint: getEnvValue(process.env.NEXT_PUBLIC_VISUALIZE_API_HOST),
    basePath: '',
  },
  homepage: {
    charts: parseEnvJson<Array<ChainIndicatorId>>(getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_CHARTS)) || [],
    plateGradient: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_PLATE_GRADIENT) ||
      'radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%)',
    showGasTracker: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER) === 'false' ? false : true,
    showAvgBlockTime: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME) === 'false' ? false : true,
  },
  walletConnect: {
    projectId: getEnvValue(process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID),
  },
  apiDoc: {
    specUrl: getEnvValue(process.env.NEXT_PUBLIC_API_SPEC_URL),
  },
  reCaptcha: {
    siteKey: getEnvValue(process.env.NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY) || '',
  },
  googleAnalytics: {
    propertyId: getEnvValue(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID),
  },
  graphQL: {
    defaultTxnHash: getEnvValue(process.env.NEXT_PUBLIC_GRAPHIQL_TRANSACTION) || '',
  },
});

export default config;
