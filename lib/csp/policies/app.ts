import type CspDev from 'csp-dev';

import appConfig from 'configs/app/config';
import featuredNetworks from 'lib/networks/featuredNetworks';

import { KEY_WORDS } from '../utils';

const MAIN_DOMAINS = [
  `*.${ appConfig.host }`,
  appConfig.host,
  appConfig.visualizeApi.endpoint,
].filter(Boolean);
// eslint-disable-next-line no-restricted-properties
const REPORT_URI = process.env.SENTRY_CSP_REPORT_URI;

function getNetworksExternalAssetsHosts() {
  const icons = featuredNetworks
    .filter(({ icon }) => typeof icon === 'string')
    .map(({ icon }) => new URL(icon as string).host);

  const logo = appConfig.network.logo ? new URL(appConfig.network.logo).host : undefined;

  return logo ? icons.concat(logo) : icons;
}

function getMarketplaceAppsHosts() {
  return {
    frames: appConfig.marketplaceAppList.map(({ url }) => new URL(url).host),
    logos: appConfig.marketplaceAppList.map(({ logo }) => new URL(logo).host),
  };
}

export default function generateAppDescriptor(): CspDev.DirectiveDescriptor {
  const marketplaceAppsHosts = getMarketplaceAppsHosts();

  return {
    'default-src': [
      KEY_WORDS.NONE,
    ],

    'connect-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // webpack hmr in safari doesn't recognize localhost as 'self' for some reason
      appConfig.isDev ? 'ws://localhost:3000/_next/webpack-hmr' : '',

      // API
      appConfig.api.endpoint,
      appConfig.api.socket,
      appConfig.statsApi.endpoint,

      // chain RPC server
      appConfig.network.rpcUrl,
      'https://infragrid.v.network', // RPC providers

      // github (spec for api-docs page)
      'raw.githubusercontent.com',
    ].filter(Boolean),

    'script-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // next.js generates and rebuilds source maps in dev using eval()
      // https://github.com/vercel/next.js/issues/14221#issuecomment-657258278
      appConfig.isDev ? KEY_WORDS.UNSAFE_EVAL : '',

      // hash of ColorModeScript
      '\'sha256-e7MRMmTzLsLQvIy1iizO1lXf7VWYoQ6ysj5fuUzvRwE=\'',
    ],

    'style-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // yes, it is unsafe as it stands, but
      // - we cannot use hashes because all styles are generated dynamically
      // - we cannot use nonces since we are not following along SSR path
      // - and still there is very small damage that can be cause by CSS-based XSS-attacks
      // so we hope we are fine here till the first major incident :)
      KEY_WORDS.UNSAFE_INLINE,
    ],

    'img-src': [
      KEY_WORDS.SELF,
      KEY_WORDS.DATA,
      ...MAIN_DOMAINS,

      // github assets (e.g trustwallet token icons)
      'raw.githubusercontent.com',

      // auth0 assets and avatars
      's.gravatar.com',
      'i0.wp.com', 'i1.wp.com', 'i2.wp.com', 'i3.wp.com',
      'lh3.googleusercontent.com', // google avatars
      'avatars.githubusercontent.com', // github avatars

      // network assets
      ...getNetworksExternalAssetsHosts(),

      // marketplace apps logos
      ...marketplaceAppsHosts.logos,

      // token's media
      'ipfs.io',
    ],

    'font-src': [
      KEY_WORDS.DATA,
    ],

    'object-src': [
      KEY_WORDS.NONE,
    ],

    'base-uri': [
      KEY_WORDS.NONE,
    ],

    'frame-src': [
      ...marketplaceAppsHosts.frames,
    ],

    ...(REPORT_URI && !appConfig.isDev ? {
      'report-uri': [
        REPORT_URI,
      ],
    } : {}),
  };
}
