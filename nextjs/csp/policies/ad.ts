import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import type CspDev from 'csp-dev';

import { connectAdbutler, placeAd } from 'ui/shared/ad/adbutlerScript';
import { hypeInit } from 'ui/shared/ad/hypeBannerScript';

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
    ],
    'frame-src': [
      // coinzilla
      'https://request-global.czilladx.com',
    ],
    'script-src': [
      // coinzilla
      'coinzillatag.com',

      // adbutler
      'servedbyadbutler.com',
      `'sha256-${ Base64.stringify(sha256(connectAdbutler)) }'`,
      `'sha256-${ Base64.stringify(sha256(placeAd(undefined) ?? '')) }'`,
      `'sha256-${ Base64.stringify(sha256(placeAd('mobile') ?? '')) }'`,

      // slise
      '*.slise.xyz',

      //hype
      `'sha256-${ Base64.stringify(sha256(hypeInit ?? '')) }'`,
      'https://api.hypelab.com',
      'd1q98dzwj6s2rb.cloudfront.net',
    ],
    'img-src': [
      // coinzilla
      'cdn.coinzilla.io',

      // adbutler
      'servedbyadbutler.com',
    ],
    'font-src': [
      // coinzilla
      'https://request-global.czilladx.com',
    ],
  };
}
