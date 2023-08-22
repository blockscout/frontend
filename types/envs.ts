export type NextPublicEnvs = {
  // app envs
  NEXT_PUBLIC_APP_PROTOCOL?: 'http' | 'https';
  NEXT_PUBLIC_APP_HOST: string;
  NEXT_PUBLIC_APP_PORT?: string;

  // blockchain parameters
  NEXT_PUBLIC_NETWORK_NAME: string;
  NEXT_PUBLIC_NETWORK_SHORT_NAME?: string;
  NEXT_PUBLIC_NETWORK_ID: string;
  NEXT_PUBLIC_NETWORK_RPC_URL?: string;
  NEXT_PUBLIC_NETWORK_CURRENCY_NAME?: string;
  NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL?: string;
  NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS?: string;
  NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE?: 'validation' | 'mining';
  NEXT_PUBLIC_IS_TESTNET?: 'true' | '';

  // api envs
  NEXT_PUBLIC_API_PROTOCOL?: 'http' | 'https';
  NEXT_PUBLIC_API_HOST: string;
  NEXT_PUBLIC_API_PORT?: string;
  NEXT_PUBLIC_API_BASE_PATH?: string;
  NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL?: 'ws' | 'wss';

  // UI configuration envs
  //     homepage
  NEXT_PUBLIC_HOMEPAGE_CHARTS?: string;
  NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR?: string;
  NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND?: string;
  NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER?: 'true' | 'false';
  NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME?: 'true' | 'false';
  //     sidebar
  NEXT_PUBLIC_FEATURED_NETWORKS?: string;
  NEXT_PUBLIC_OTHER_LINKS?: string;
  NEXT_PUBLIC_NETWORK_LOGO?: string;
  NEXT_PUBLIC_NETWORK_LOGO_DARK?: string;
  NEXT_PUBLIC_NETWORK_ICON?: string;
  NEXT_PUBLIC_NETWORK_ICON_DARK?: string;
  //     footer
  NEXT_PUBLIC_FOOTER_LINKS?: string;
  //     views
  NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS?: string;
  //     misc
  NEXT_PUBLIC_NETWORK_EXPLORERS?: string;
  NEXT_PUBLIC_HIDE_INDEXING_ALERT?: 'true' | 'false';

  // features envs
  NEXT_PUBLIC_API_SPEC_URL?: string;
  NEXT_PUBLIC_GRAPHIQL_TRANSACTION?: string;
  NEXT_PUBLIC_WEB3_WALLETS?: string;
  NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET?: 'true' | 'false';
  NEXT_PUBLIC_AD_TEXT_PROVIDER?: 'coinzilla' | 'none';
  NEXT_PUBLIC_STATS_API_HOST?: string;
  NEXT_PUBLIC_VISUALIZE_API_HOST?: string;
  NEXT_PUBLIC_CONTRACT_INFO_API_HOST?: string;

  // external services envs
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?: string;
  NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY?: string;
  NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID?: string;
  NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN?: string;

  // utilities
  NEXT_PUBLIC_GIT_TAG?: string;
  NEXT_PUBLIC_GIT_COMMIT_SHA?: string;
}
& NextPublicEnvsAccount
& NextPublicEnvsMarketplace
& NextPublicEnvsRollup
& NextPublicEnvsBeacon
& NextPublicEnvsAdsBanner
& NextPublicEnvsSentry;

type NextPublicEnvsAccount =
{
  NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED?: undefined;
  NEXT_PUBLIC_AUTH_URL?: undefined;
  NEXT_PUBLIC_LOGOUT_URL?: undefined;
  NEXT_PUBLIC_AUTH0_CLIENT_ID?: undefined;
} |
{
  NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'true';
  NEXT_PUBLIC_AUTH_URL?: string;
  NEXT_PUBLIC_LOGOUT_URL: string;
  NEXT_PUBLIC_AUTH0_CLIENT_ID: string;
  NEXT_PUBLIC_ADMIN_SERVICE_API_HOST?: string;
}

type NextPublicEnvsMarketplace =
{
  NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: string;
  NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM: string;
} |
{
  NEXT_PUBLIC_MARKETPLACE_CONFIG_URL?: undefined;
  NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM?: undefined;
}

type NextPublicEnvsRollup =
{
  NEXT_PUBLIC_IS_L2_NETWORK: 'true';
  NEXT_PUBLIC_L1_BASE_URL: string;
  NEXT_PUBLIC_L2_WITHDRAWAL_URL: string;
} |
{
  NEXT_PUBLIC_IS_L2_NETWORK?: undefined;
  NEXT_PUBLIC_L1_BASE_URL?: undefined;
  NEXT_PUBLIC_L2_WITHDRAWAL_URL?: undefined;
}

type NextPublicEnvsBeacon =
{
  NEXT_PUBLIC_HAS_BEACON_CHAIN: 'true';
  NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL?: string;
} |
{
  NEXT_PUBLIC_HAS_BEACON_CHAIN?: undefined;
  NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL?: undefined;
}

type NextPublicEnvsAdsBanner =
{
  NEXT_PUBLIC_AD_BANNER_PROVIDER: 'slise' | 'coinzilla' | 'none';
} |
{
  NEXT_PUBLIC_AD_BANNER_PROVIDER: 'adbutler';
  NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP: string;
  NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE: string;
} |
{
  NEXT_PUBLIC_AD_BANNER_PROVIDER?: undefined;
}

type NextPublicEnvsSentry =
{
  NEXT_PUBLIC_SENTRY_DSN: string;
  SENTRY_CSP_REPORT_URI?: string;
  NEXT_PUBLIC_APP_INSTANCE?: string;
  NEXT_PUBLIC_APP_ENV?: string;
} |
{
  NEXT_PUBLIC_SENTRY_DSN?: undefined;
  SENTRY_CSP_REPORT_URI?: undefined;
  NEXT_PUBLIC_APP_INSTANCE?: undefined;
  NEXT_PUBLIC_APP_ENV?: undefined;
}
