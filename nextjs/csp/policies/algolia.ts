import type CspDev from 'csp-dev';

export function algolia(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      'https://*.algolia.net',
      'https://*.algolianet.com',
      'https://*.algolia.io',
    ],
  };
}
