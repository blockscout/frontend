import type CspDev from 'csp-dev';

export function sentry(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      'sentry.io',
      '*.sentry.io',
    ],
  };
}
