// SPDX-License-Identifier: LicenseRef-Blockscout

import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import type CspDev from 'csp-dev';

import { connectAdbutler, placeAd } from 'ui/shared/ad/adbutlerScript';

export function ad(nonce?: string): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      // sevio
      '*.adx.ws',
      'https://request.adx.ws',
      'https://id5-sync.com',
      'https://lb.eu-1-id5-sync.com/lb/v1',

      // adbutler
      'servedbyadbutler.com',

      // slise
      '*.slise.xyz',

      // specify
      'app.specify.sh',
    ],
    'frame-src': [],
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
      ...(nonce ? [ `'nonce-${ nonce }'` ] : []),
    ],
    'img-src': [
      // adbutler
      'servedbyadbutler.com',

      // sevio
      '*.adx.ws',
    ],
    'font-src': [],
  };
}
