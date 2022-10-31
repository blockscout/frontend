/* eslint-disable no-restricted-properties */
import type { AppItemOverview } from 'types/client/apps';
import type { FeaturedNetwork, NetworkExplorer, PreDefinedNetwork } from 'types/networks';

const getEnvValue = (env: string | undefined) => env?.replaceAll('\'', '"');
const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null');
  } catch (error) {
    return null;
  }
};

const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
const isDev = env === 'development';

const appPort = getEnvValue(process.env.NEXT_PUBLIC_APP_PORT);
const appSchema = getEnvValue(process.env.NEXT_PUBLIC_APP_PROTOCOL);
const appHost = getEnvValue(process.env.NEXT_PUBLIC_APP_HOST);
const baseUrl = [
  appSchema || 'https',
  '://',
  process.env.NEXT_PUBLIC_VERCEL_URL || appHost,
  appPort && ':' + appPort,
].filter(Boolean).join('');

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
    name: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_NAME),
    id: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ID),
    shortName: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_SHORT_NAME),
    currency: {
      name: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_NAME),
      symbol: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL),
      decimals: Number(getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS)) || DEFAULT_CURRENCY_DECIMALS,
    },
    assetsPathname: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ASSETS_PATHNAME),
    nativeTokenAddress: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS),
    explorers: parseEnvJson<Array<NetworkExplorer>>(getEnvValue(process.env.NEXT_PUBLIC_NETWORK_EXPLORERS)) || [],
    verificationType: process.env.NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE || 'mining',
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
  logoutUrl,
  api: {
    endpoint: getEnvValue(process.env.NEXT_PUBLIC_API_ENDPOINT) || 'https://blockscout.com',
    basePath: getEnvValue(process.env.NEXT_PUBLIC_API_BASE_PATH) || '',
  },
});

export default config;
