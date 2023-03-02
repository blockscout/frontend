import type CspDev from 'csp-dev';

export default function generateSentryDescriptor(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      'sentry.io',
      '*.sentry.io',
    ],
  };
}
