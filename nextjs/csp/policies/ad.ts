import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import type CspDev from 'csp-dev';

import { connectAdbutler, placeAd } from 'ui/shared/ad/adbutlerScript';

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

      // specify
      'app.specify.sh',
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
      `'sha256-${ Base64.stringify(sha256(placeAd(false) ?? '')) }'`,
      `'sha256-${ Base64.stringify(sha256(placeAd(true) ?? '')) }'`,

      // slise
      '*.slise.xyz',
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
