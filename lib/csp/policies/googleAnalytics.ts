import type CspDev from 'csp-dev';

import config from 'configs/app';

export function googleAnalytics(): CspDev.DirectiveDescriptor {
  if (!config.features.googleAnalytics.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      '*.google-analytics.com',
      '*.analytics.google.com',
      'https://www.googletagmanager.com',
      'https://stats.g.doubleclick.net',
    ],
    'script-src': [
      // inline script hash, see ui/shared/GoogleAnalytics.tsx
      '\'sha256-NTmEg2dBnojQfTYrYJEmp3nG7V66756qPbQMCIBrctk=\'',
      'https://www.googletagmanager.com',
      '*.google-analytics.com',
      '*.analytics.google.com',
    ],
    'img-src': [
      '*.google-analytics.com',
      '*.analytics.google.com',
    ],
  };
}
