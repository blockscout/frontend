import appConfig from 'configs/app/config';
import featuredNetworks from 'lib/networks/featuredNetworks';

const KEY_WORDS = {
  BLOB: 'blob:',
  DATA: 'data:',
  NONE: '\'none\'',
  REPORT_SAMPLE: `'report-sample'`,
  SELF: '\'self\'',
  STRICT_DYNAMIC: `'strict-dynamic'`,
  UNSAFE_INLINE: '\'unsafe-inline\'',
  UNSAFE_EVAL: '\'unsafe-eval\'',
};

const MAIN_DOMAINS = [ `*.${ appConfig.host }`, appConfig.host ];
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

// we cannot use lodash/uniq in middleware code since it calls new Set() and it'is causing an error in Nextjs
// "Dynamic Code Evaluation (e. g. 'eval', 'new Function', 'WebAssembly.compile') not allowed in Edge Runtime"
function unique(array: Array<string | undefined>) {
  const set: Record<string, boolean> = {};
  for (const item of array) {
    item && (set[item] = true);
  }

  return Object.keys(set);
}

function makePolicyMap() {
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

      // client error monitoring
      'sentry.io', '*.sentry.io',

      // API
      appConfig.api.endpoint,
      appConfig.api.socket,
      appConfig.statsApi.endpoint,

      // chain RPC server
      appConfig.network.rpcUrl,

      // ad
      'request-global.czilladx.com',

      // walletconnect
      '*.walletconnect.com',
      'wss://*.bridge.walletconnect.org',
      'wss://www.walletlink.org',
    ],

    'script-src': [
      KEY_WORDS.SELF,

      // next.js generates and rebuilds source maps in dev using eval()
      // https://github.com/vercel/next.js/issues/14221#issuecomment-657258278
      appConfig.isDev ? KEY_WORDS.UNSAFE_EVAL : '',

      ...MAIN_DOMAINS,

      // hash of ColorModeScript
      '\'sha256-e7MRMmTzLsLQvIy1iizO1lXf7VWYoQ6ysj5fuUzvRwE=\'',

      // ad
      'coinzillatag.com',
      'servedbyadbutler.com',
      '\'sha256-wMOeDjJaOTjCfNjluteV+tSqHW547T89sgxd8W6tQJM=\'',
      '\'sha256-FcyIn1h7zra8TVnnRhYrwrplxJW7dpD5TV7kP2AG/kI=\'',

      // reCAPTCHA from google
      'https://www.google.com/recaptcha/api.js',
      'https://www.gstatic.com',
      '\'sha256-FDyPg8CqqIpPAfGVKx1YeKduyLs0ghNYWII21wL+7HM=\'',
    ],

    'style-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // google fonts
      'fonts.googleapis.com',

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

      // ad
      'servedbyadbutler.com',
      'cdn.coinzilla.io',

      // walletconnect
      '*.walletconnect.com',

      // token's media
      'ipfs.io',
    ],

    'font-src': [
      KEY_WORDS.DATA,

      // google fonts
      'fonts.gstatic.com',
      'fonts.googleapis.com',
    ],

    'prefetch-src': [
      ...MAIN_DOMAINS,
    ],

    'object-src': [
      KEY_WORDS.NONE,
    ],

    'base-uri': [
      KEY_WORDS.NONE,
    ],

    'frame-src': [
      ...marketplaceAppsHosts.frames,

      // ad
      'request-global.czilladx.com',

      // reCAPTCHA from google
      // 'https://www.google.com/',
      'https://www.google.com/recaptcha/api2/anchor',
      'https://www.google.com/recaptcha/api2/bframe',
    ],

    ...(REPORT_URI ? {
      'report-uri': [
        REPORT_URI,
      ],
    } : {}),
  };
}

function getCspPolicy() {
  const policyMap = makePolicyMap();

  const policyString = Object.entries(policyMap)
    .map(([ key, value ]) => {
      if (!value || value.length === 0) {
        return;
      }

      const uniqueValues = unique(value);
      return [ key, uniqueValues.join(' ') ].join(' ');
    })
    .filter(Boolean)
    .join(';');

  return policyString;
}

export default getCspPolicy;
