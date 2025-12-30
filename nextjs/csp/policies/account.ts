import type CspDev from 'csp-dev';

import config from 'configs/app';

const accountFeature = config.features.account;

export function account(): CspDev.DirectiveDescriptor {
  if (accountFeature.isEnabled && accountFeature.authProvider === 'dynamic') {
    return {
      'connect-src': [
        'https://dynamic-static-assets.com',
        'https://app.dynamicauth.com',
        'https://logs.dynamicauth.com',
      ],
      'font-src': [
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-italic.woff2',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-italic.woff',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-italic.woff2',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-italic.woff',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-italic.woff2',
        'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-italic.woff',
      ],
    };
  }

  return {};
}
