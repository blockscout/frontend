import type CspDev from 'csp-dev';

import appConfig from 'configs/app/config';

export function googleAnalytics(): CspDev.DirectiveDescriptor {
  if (!appConfig.googleAnalytics.propertyId) {
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
