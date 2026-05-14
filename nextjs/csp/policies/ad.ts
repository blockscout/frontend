// SPDX-License-Identifier: LicenseRef-Blockscout

import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import type CspDev from 'csp-dev';

import { connectAdbutler, placeAd } from 'ui/shared/ad/adbutlerScript';

export function ad(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      // sevio
      '*.adx.ws',
      'https://id5-sync.com',
      'https://lb.eu-1-id5-sync.com/lb/v1',
      'https://request-global.czilladx.com',

      // adbutler
      'servedbyadbutler.com',

      // slise
      '*.slise.xyz',

      // specify
      'app.specify.sh',
    ],
    'frame-src': [
      // sevio
      'https://request-global.czilladx.com',
    ],
    'script-src': [
      // adbutler
      'servedbyadbutler.com',
      `'sha256-${ Base64.stringify(sha256(connectAdbutler)) }'`,
      `'sha256-${ Base64.stringify(sha256(placeAd(false) ?? '')) }'`,
      `'sha256-${ Base64.stringify(sha256(placeAd(true) ?? '')) }'`,

      // slise
      '*.slise.xyz',

      // sevio
      'cdn.adx.ws',
    ],
    'img-src': [
      // adbutler
      'servedbyadbutler.com',

      // sevio
      '*.adx.ws',
      'https://request-global.czilladx.com',
    ],
    'font-src': [],
  };
}
