import type CspDev from 'csp-dev';

export function ad(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      // coinzilla
      'coinzilla.com',
      '*.coinzilla.com',
      'https://request-global.czilladx.com',

      // adbutler
      'servedbyadbutler.com',

      // slise
      '*.slise.xyz',

      // hype
      'api.hypelab.com',
      '*.ixncdn.com',
      '*.cloudfront.net',

      //getit
      'v1.getittech.io',
      'ipapi.co',
    ],
  };
}
