import * as yup from 'yup';

import type { AdButlerConfig } from '../../../types/client/adButlerConfig';
import { SUPPORTED_AD_TEXT_PROVIDERS, SUPPORTED_AD_BANNER_PROVIDERS } from '../../../types/client/adProviders';
import type { AdTextProviders, AdBannerProviders } from '../../../types/client/adProviders';
import type { MarketplaceAppOverview } from '../../../types/client/marketplace';
import type { NavItemExternal } from '../../../types/client/navigation-items';
import type { WalletType } from '../../../types/client/wallets';
import { SUPPORTED_WALLETS } from '../../../types/client/wallets';
import type { CustomLink, CustomLinksGroup } from '../../../types/footerLinks';
import type { ChainIndicatorId } from '../../../types/homepage';
import { type NetworkVerificationType, type NetworkExplorer, type FeaturedNetwork, NETWORK_GROUPS } from '../../../types/networks';
import { BLOCK_FIELDS_IDS } from '../../../types/views/block';
import type { BlockFieldId } from '../../../types/views/block';

import { getEnvValue } from '../../../configs/app/utils';
import * as regexp from '../../../lib/regexp';

const protocols = [ 'http', 'https' ];

const marketplaceAppSchema: yup.ObjectSchema<MarketplaceAppOverview> = yup
  .object({
    id: yup.string().required(),
    external: yup.boolean(),
    title: yup.string().required(),
    logo: yup.string().url().required(),
    logoDarkMode: yup.string().url(),
    shortDescription: yup.string().required(),
    categories: yup.array().of(yup.string().required()).required(),
    url: yup.string().url().required(),
    author: yup.string().required(),
    description: yup.string().required(),
    site: yup.string().url(),
    twitter: yup.string().url(),
    telegram: yup.string().url(),
    github: yup.string().url(),
  });

const marketplaceSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: yup
      .array()
      .json()
      .of(marketplaceAppSchema),
    NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM: yup
      .string()
      .when('NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', {
        is: (value: Array<unknown>) => value.length > 0,
        then: (schema) => schema.url().required(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM cannot not be used without NEXT_PUBLIC_MARKETPLACE_CONFIG_URL'),
      }),
  });

const beaconChainSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_HAS_BEACON_CHAIN: yup.boolean(),
    NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL: yup
      .string()
      .when('NEXT_PUBLIC_HAS_BEACON_CHAIN', {
        is: (value: boolean) => value,
        then: (schema) => schema.min(1).optional(),
        otherwise: (schema) => schema.max(
          -1,
          'NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL cannot not be used if NEXT_PUBLIC_HAS_BEACON_CHAIN is not set to "true"',
        ),
      }),
  });

const rollupSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_IS_L2_NETWORK: yup.boolean(),
    NEXT_PUBLIC_L1_BASE_URL: yup
      .string()
      .when('NEXT_PUBLIC_IS_L2_NETWORK', {
        is: (value: boolean) => value,
        then: (schema) => schema.url().required(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_L1_BASE_URL cannot not be used if NEXT_PUBLIC_IS_L2_NETWORK is not set to "true"'),
      }),
    NEXT_PUBLIC_L2_WITHDRAWAL_URL: yup
      .string()
      .when('NEXT_PUBLIC_IS_L2_NETWORK', {
        is: (value: string) => value,
        then: (schema) => schema.url().required(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_L2_WITHDRAWAL_URL cannot not be used if NEXT_PUBLIC_IS_L2_NETWORK is not set to "true"'),
      }),
  });

const adButlerConfigSchema = yup
  .object<AdButlerConfig>()
  .transform(getEnvValue)
  .json()
  .when('NEXT_PUBLIC_AD_BANNER_PROVIDER', {
    is: (value: AdBannerProviders) => value === 'adbutler',
    then: (schema) => schema
      .shape({
        id: yup.string().required(),
        width: yup.number().positive().required(),
        height: yup.number().positive().required(),
      })
      .required(),
  });

const adsBannerSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_AD_BANNER_PROVIDER: yup.string<AdBannerProviders>().oneOf(SUPPORTED_AD_BANNER_PROVIDERS),
    NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP: adButlerConfigSchema,
    NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE: adButlerConfigSchema,
  });

const sentrySchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_SENTRY_DSN: yup.string().url(),
    SENTRY_CSP_REPORT_URI: yup
      .string()
      .when('NEXT_PUBLIC_SENTRY_DSN', {
        is: (value: string) => Boolean(value),
        then: (schema) => schema.url(),
        otherwise: (schema) => schema.max(-1, 'SENTRY_CSP_REPORT_URI cannot not be used without NEXT_PUBLIC_SENTRY_DSN'),
      }),
    NEXT_PUBLIC_APP_INSTANCE: yup
      .string()
      .when('NEXT_PUBLIC_SENTRY_DSN', {
        is: (value: string) => Boolean(value),
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_APP_INSTANCE cannot not be used without NEXT_PUBLIC_SENTRY_DSN'),
      }),
    NEXT_PUBLIC_APP_ENV: yup
      .string()
      .when('NEXT_PUBLIC_SENTRY_DSN', {
        is: (value: string) => Boolean(value),
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_APP_ENV cannot not be used without NEXT_PUBLIC_SENTRY_DSN'),
      }),
  });

const accountSchema = yup
  .object()
  .shape({
    NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: yup.boolean(),
    NEXT_PUBLIC_AUTH0_CLIENT_ID: yup
      .string()
      .when('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
        is: (value: boolean) => value,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_AUTH0_CLIENT_ID cannot not be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is not set to "true"'),
      }),
    NEXT_PUBLIC_AUTH_URL: yup
      .string()
      .when('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
        is: (value: boolean) => value,
        then: (schema) => schema.url(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_AUTH_URL cannot not be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is not set to "true"'),
      }),
    NEXT_PUBLIC_LOGOUT_URL: yup
      .string()
      .when('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
        is: (value: boolean) => value,
        then: (schema) => schema.url().required(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_LOGOUT_URL cannot not be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is not set to "true"'),
      }),
    NEXT_PUBLIC_ADMIN_SERVICE_API_HOST: yup
      .string()
      .when('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
        is: (value: boolean) => value,
        then: (schema) => schema.url(),
        otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_ADMIN_SERVICE_API_HOST cannot not be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is not set to "true"'),
      }),
  });

const featuredNetworkSchema: yup.ObjectSchema<FeaturedNetwork> = yup
  .object()
  .shape({
    title: yup.string().required(),
    url: yup.string().url().required(),
    group: yup.string().oneOf(NETWORK_GROUPS).required(),
    icon: yup.string().url(),
    isActive: yup.boolean(),
    invertIconInDarkMode: yup.boolean(),
  });

const navItemExternalSchema: yup.ObjectSchema<NavItemExternal> = yup
  .object({
    text: yup.string().required(),
    url: yup.string().url().required(),
  });

const footerLinkSchema: yup.ObjectSchema<CustomLink> = yup
  .object({
    text: yup.string().required(),
    url: yup.string().url().required(),
  });

const footerLinkGroupSchema: yup.ObjectSchema<CustomLinksGroup> = yup
  .object({
    title: yup.string().required(),
    links: yup
      .array()
      .of(footerLinkSchema)
      .required(),
  });

const networkExplorerSchema: yup.ObjectSchema<NetworkExplorer> = yup
  .object({
    title: yup.string().required(),
    baseUrl: yup.string().url().required(),
    paths: yup
      .object()
      .shape({
        tx: yup.string(),
        address: yup.string(),
        token: yup.string(),
        block: yup.string(),
      }),
  });

const schema = yup
  .object()
  .noUnknown(true, (params) => {
    return `Unknown ENV variables were provided: ${ params.unknown }`;
  })
  .shape({
    // I. Build-time ENVs
    // -----------------
    NEXT_PUBLIC_GIT_TAG: yup.string(),
    NEXT_PUBLIC_GIT_COMMIT_SHA: yup.string(),

    // II. Run-time ENVs
    // -----------------
    // 1. App configuration
    NEXT_PUBLIC_APP_HOST: yup.string().required(),
    NEXT_PUBLIC_APP_PROTOCOL: yup.string().oneOf(protocols),
    NEXT_PUBLIC_APP_PORT: yup.number().positive().integer(),

    // 2. Blockchain parameters
    NEXT_PUBLIC_NETWORK_NAME: yup.string().required(),
    NEXT_PUBLIC_NETWORK_SHORT_NAME: yup.string(),
    NEXT_PUBLIC_NETWORK_ID: yup.number().positive().integer().required(),
    NEXT_PUBLIC_NETWORK_RPC_URL: yup.string().url(),
    NEXT_PUBLIC_NETWORK_CURRENCY_NAME: yup.string(),
    NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL: yup.string(),
    NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS: yup.number().integer().positive(),
    NEXT_PUBLIC_NETWORK_GOVERNANCE_TOKEN_SYMBOL: yup.string(),
    NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: yup.string<NetworkVerificationType>().oneOf([ 'validation', 'mining' ]),
    NEXT_PUBLIC_IS_TESTNET: yup.boolean(),

    // 3. API configuration
    NEXT_PUBLIC_API_PROTOCOL: yup.string().oneOf(protocols),
    NEXT_PUBLIC_API_HOST: yup.string().required(),
    NEXT_PUBLIC_API_PORT: yup.number().integer().positive(),
    NEXT_PUBLIC_API_BASE_PATH: yup.string(),
    NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: yup.string().oneOf([ 'ws', 'wss' ]),

    // 4. UI configuration
    //   a. homepage
    NEXT_PUBLIC_HOMEPAGE_CHARTS: yup
      .array()
      .transform(getEnvValue)
      .json()
      .of(yup.string<ChainIndicatorId>().oneOf([ 'daily_txs', 'coin_price', 'market_cap' ])),
    NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR: yup.string(),
    NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND: yup.string(),
    NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER: yup.boolean(),
    NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME: yup.boolean(),

    //     b. sidebar
    NEXT_PUBLIC_FEATURED_NETWORKS: yup
      .array()
      .json()
      .of(featuredNetworkSchema),
    NEXT_PUBLIC_OTHER_LINKS: yup
      .array()
      .transform(getEnvValue)
      .json()
      .of(navItemExternalSchema),
    NEXT_PUBLIC_NETWORK_LOGO: yup.string().url(),
    NEXT_PUBLIC_NETWORK_LOGO_DARK: yup.string().url(),
    NEXT_PUBLIC_NETWORK_ICON: yup.string().url(),
    NEXT_PUBLIC_NETWORK_ICON_DARK: yup.string().url(),

    //     c. footer
    NEXT_PUBLIC_FOOTER_LINKS: yup
      .array()
      .json()
      .of(footerLinkGroupSchema),

    //     d. views
    NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS: yup
      .array()
      .transform(getEnvValue)
      .json()
      .of(yup.string<BlockFieldId>().oneOf(BLOCK_FIELDS_IDS)),

    //     e. misc
    NEXT_PUBLIC_NETWORK_EXPLORERS: yup
      .array()
      .transform(getEnvValue)
      .json()
      .of(networkExplorerSchema),
    NEXT_PUBLIC_HIDE_INDEXING_ALERT: yup.boolean(),

    // 5. Features configuration
    NEXT_PUBLIC_API_SPEC_URL: yup.string().url(),
    NEXT_PUBLIC_STATS_API_HOST: yup.string().url(),
    NEXT_PUBLIC_VISUALIZE_API_HOST: yup.string().url(),
    NEXT_PUBLIC_CONTRACT_INFO_API_HOST: yup.string().url(),
    NEXT_PUBLIC_GRAPHIQL_TRANSACTION: yup.string().matches(regexp.HEX_REGEXP),
    NEXT_PUBLIC_WEB3_WALLETS: yup
      .mixed()
      .test('shape', 'Invalid schema were provided for NEXT_PUBLIC_WEB3_WALLETS, it should be either array or "none" string literal', (data) => {
        const isNoneSchema = yup.string().equals([ 'none' ]);
        const isArrayOfWalletsSchema = yup
          .array()
          .transform(getEnvValue)
          .json()
          .of(yup.string<WalletType>().oneOf(SUPPORTED_WALLETS));

        return isNoneSchema.isValidSync(data) || isArrayOfWalletsSchema.isValidSync(data);
      }),
    NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET: yup.boolean(),
    NEXT_PUBLIC_AD_TEXT_PROVIDER: yup.string<AdTextProviders>().oneOf(SUPPORTED_AD_TEXT_PROVIDERS),

    // 6. External services envs
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: yup.string(),
    NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY: yup.string(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID: yup.string(),
    NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN: yup.string(),
  })
  .concat(accountSchema)
  .concat(adsBannerSchema)
  .concat(marketplaceSchema)
  .concat(rollupSchema)
  .concat(beaconChainSchema)
  .concat(sentrySchema);

export default schema;
