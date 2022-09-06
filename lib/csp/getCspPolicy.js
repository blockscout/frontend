const parseNetworkConfig = require('../networks/parseNetworkConfig');

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

const MAIN_DOMAINS = [ '*.blockscout.com', 'blockscout.com' ];

const isDev = process.env.NODE_ENV === 'development';

function getNetworksExternalAssets() {
  const icons = parseNetworkConfig()
    .filter(({ icon }) => typeof icon === 'string')
    .map(({ icon }) => new URL(icon));

  return icons;
}

function makePolicyMap() {
  const networkExternalAssets = getNetworksExternalAssets();

  return {
    'default-src': [
      KEY_WORDS.NONE,
    ],

    'connect-src': [
      KEY_WORDS.SELF,

      // webpack hmr in safari doesn't recognize localhost as 'self' for some reason
      isDev ? 'ws://localhost:3000/_next/webpack-hmr' : '',

      // client error monitoring
      'sentry.io', '*.sentry.io',
    ],

    'script-src': [
      KEY_WORDS.SELF,

      // next.js generates and rebuilds source maps in dev using eval()
      // https://github.com/vercel/next.js/issues/14221#issuecomment-657258278
      isDev ? KEY_WORDS.UNSAFE_EVAL : '',

      ...MAIN_DOMAINS,

      // hash of ColorModeScript
      '\'sha256-e7MRMmTzLsLQvIy1iizO1lXf7VWYoQ6ysj5fuUzvRwE=\'',
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

      // github avatars
      'avatars.githubusercontent.com',

      // network assets
      ...networkExternalAssets.map((url) => url.host),
    ],

    'font-src': [
      KEY_WORDS.DATA,

      // google fonts
      '*.gstatic.com',
      'fonts.googleapis.com',
    ],

    'object-src': [
      KEY_WORDS.NONE,
    ],

    'base-uri': [
      KEY_WORDS.NONE,
    ],

    'report-uri': [
      process.env.SENTRY_CSP_REPORT_URI,
    ],
  };
}

function getCspPolicy() {
  const policyMap = makePolicyMap();

  const policyString = Object.entries(policyMap)
    .map(([ key, value ]) => {
      if (!value || value.length === 0) {
        return;
      }

      return [ key, value.join(' ') ].join(' ');
    })
    .filter(Boolean)
    .join(';');

  return policyString;
}

module.exports = getCspPolicy;
