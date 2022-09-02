const CONSTS = {
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

function makePolicyMap() {
  return {
    'default-src': [
      CONSTS.NONE,
    ],

    'connect-src': [
      CONSTS.SELF,
      'sentry.io', '*.sentry.io', // client error monitoring
    ],

    'script-src': [
      CONSTS.SELF,
      ...MAIN_DOMAINS,

      CONSTS.UNSAFE_INLINE,
      CONSTS.UNSAFE_EVAL,
    ],

    'style-src': [
      CONSTS.SELF,
      ...MAIN_DOMAINS,
      'fonts.googleapis.com',

      CONSTS.UNSAFE_INLINE,
    ],

    'img-src': [
      CONSTS.SELF,
      CONSTS.DATA,
      ...MAIN_DOMAINS,
      // github avatars
      'avatars.githubusercontent.com',
    ],

    'font-src': [
      CONSTS.SELF,
      CONSTS.DATA,
      // google fonts
      '*.gstatic.com',
      'fonts.googleapis.com',
    ],
  };
}

function getCspPolicy() {
  const policyMap = makePolicyMap();

  const policyHeader = Object.entries(policyMap)
    .map(([ key, value ]) => {
      if (!value || value.length === 0) {
        return;
      }

      return [ key, value.join(' ') ].join(' ');
    })
    .filter(Boolean)
    .join(';');

  return policyHeader;
}

module.exports = getCspPolicy;
