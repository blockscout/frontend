/* eslint-disable no-restricted-properties */
import type { AdButlerConfig } from 'types/client/adButlerConfig';
import type { AdBannerProviders, AdTextProviders } from 'types/client/adProviders';
import type { NavItemExternal } from 'types/client/navigation-items';
import type { WalletType } from 'types/client/wallets';
import type { NetworkExplorer } from 'types/networks';
import type { ChainIndicatorId } from 'ui/home/indicators/types';

import stripTrailingSlash from 'lib/stripTrailingSlash';

const getEnvValue = <T extends string>(env: T | undefined): T | undefined => env?.replaceAll('\'', '"') as T;
const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null') as DataType | null;
  } catch (error) {
    return null;
  }
};

const getWeb3DefaultWallet = (): WalletType => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_WEB3_DEFAULT_WALLET);
  const SUPPORTED_WALLETS: Array<WalletType> = [
    'metamask',
    'coinbase',
  ];

  return (envValue && SUPPORTED_WALLETS.includes(envValue) ? envValue : 'metamask') as WalletType;
};

const getAdBannerProvider = (): AdBannerProviders => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_AD_BANNER_PROVIDER);
  const SUPPORTED_AD_BANNER_PROVIDERS: Array<AdBannerProviders> = [ 'slise', 'adbutler', 'coinzilla', 'none' ];

  return (envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue : 'slise') as AdBannerProviders;
};

const getAdTextProvider = (): AdTextProviders => {
  const envValue = getEnvValue(process.env.NEXT_PUBLIC_AD_TEXT_PROVIDER);
  const SUPPORTED_AD_BANNER_PROVIDERS: Array<AdTextProviders> = [ 'coinzilla', 'none' ];

  return (envValue && SUPPORTED_AD_BANNER_PROVIDERS.includes(envValue) ? envValue : 'slise') as AdTextProviders;
};

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

const socketSchema = getEnvValue(process.env.NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL) || 'wss';

const logoutUrl = (() => {
  try {
    const envUrl = getEnvValue(process.env.NEXT_PUBLIC_LOGOUT_URL);
    const auth0ClientId = getEnvValue(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID);
    const returnUrl = authUrl + '/auth/logout';

    if (!envUrl || !auth0ClientId) {
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
    logo: {
      'default': getEnvValue(process.env.NEXT_PUBLIC_NETWORK_LOGO),
      dark: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_LOGO_DARK),
    },
    icon: {
      'default': getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ICON),
      dark: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ICON_DARK),
    },
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
  navigation: {
    otherLinks: parseEnvJson<Array<NavItemExternal>>(getEnvValue(process.env.NEXT_PUBLIC_OTHER_LINKS)) || [],
    featuredNetworks: getEnvValue(process.env.NEXT_PUBLIC_FEATURED_NETWORKS),
  },
  footer: {
    links: getEnvValue(process.env.NEXT_PUBLIC_FOOTER_LINKS),
    frontendVersion: getEnvValue(process.env.NEXT_PUBLIC_GIT_TAG),
    frontendCommit: getEnvValue(process.env.NEXT_PUBLIC_GIT_COMMIT_SHA),
  },
  marketplace: {
    configUrl: getEnvValue(process.env.NEXT_PUBLIC_MARKETPLACE_CONFIG_URL),
    submitForm: getEnvValue(process.env.NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM),
  },
  account: {
    isEnabled: getEnvValue(process.env.NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED) === 'true',
    authUrl,
    logoutUrl,
  },
  app: {
    protocol: appSchema,
    host: appHost,
    port: appPort,
    baseUrl,
  },
  ad: {
    adBannerProvider: getAdBannerProvider(),
    adTextProvider: getAdTextProvider(),
    adButlerConfigDesktop: parseEnvJson<AdButlerConfig>(getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP)),
    adButlerConfigMobile: parseEnvJson<AdButlerConfig>(getEnvValue(process.env.NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE)),
  },
  web3: {
    defaultWallet: getWeb3DefaultWallet(),
    disableAddTokenToWallet: getEnvValue(process.env.NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET) === 'true',
  },
  api: {
    host: apiHost,
    endpoint: apiEndpoint,
    socket: apiHost ? `${ socketSchema }://${ apiHost }` : 'wss://blockscout.com',
    basePath: stripTrailingSlash(getEnvValue(process.env.NEXT_PUBLIC_API_BASE_PATH) || ''),
  },
  L2: {
    isL2Network: getEnvValue(process.env.NEXT_PUBLIC_IS_L2_NETWORK) === 'true',
    L1BaseUrl: getEnvValue(process.env.NEXT_PUBLIC_L1_BASE_URL),
    withdrawalUrl: getEnvValue(process.env.NEXT_PUBLIC_L2_WITHDRAWAL_URL) || '',
  },
  beaconChain: {
    hasBeaconChain: getEnvValue(process.env.NEXT_PUBLIC_HAS_BEACON_CHAIN) === 'true',
    currencySymbol: getEnvValue(process.env.NEXT_PUBLIC_BEACON_NETWORK_CURRENCY_SYMBOL) || getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL),
  },
  statsApi: {
    endpoint: getEnvValue(process.env.NEXT_PUBLIC_STATS_API_HOST),
    basePath: '',
  },
  visualizeApi: {
    endpoint: getEnvValue(process.env.NEXT_PUBLIC_VISUALIZE_API_HOST),
    basePath: '',
  },
  contractInfoApi: {
    endpoint: getEnvValue(process.env.NEXT_PUBLIC_CONTRACT_INFO_API_HOST),
    basePath: '',
  },
  adminServiceApi: {
    endpoint: getEnvValue(process.env.NEXT_PUBLIC_ADMIN_SERVICE_API_HOST),
    basePath: '',
  },
  homepage: {
    charts: parseEnvJson<Array<ChainIndicatorId>>(getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_CHARTS)) || [],
    plate: {
      background: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND) ||
        'radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)',
      textColor: getEnvValue(process.env.NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR) || 'white',
    },
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
  mixpanel: {
    projectToken: getEnvValue(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN),
  },
  graphQL: {
    defaultTxnHash: getEnvValue(process.env.NEXT_PUBLIC_GRAPHIQL_TRANSACTION) || '',
  },
  hideIndexingAlert: getEnvValue(process.env.NEXT_PUBLIC_HIDE_INDEXING_ALERT),
});

export default config;
