import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import type CspDev from 'csp-dev';

import isSelfHosted from 'lib/isSelfHosted';
import { connectAdbutler, placeAd, placeAdSPA } from 'ui/shared/ad/adbutlerScript';

export function ad(): CspDev.DirectiveDescriptor {
  if (!isSelfHosted()) {
    return {};
  }

  return {
    'connect-src': [
      'coinzilla.com',
      '*.coinzilla.com',
      'request-global.czilladx.com',
      '*.slise.xyz',
    ],
    'frame-src': [
      'request-global.czilladx.com',
    ],
    'script-src': [
      'coinzillatag.com',
      'servedbyadbutler.com',
      `'sha256-${ Base64.stringify(sha256(connectAdbutler)) }'`,
      `'sha256-${ Base64.stringify(sha256(placeAd)) }'`,
      `'sha256-${ Base64.stringify(sha256(placeAdSPA)) }'`,
      '*.slise.xyz',
    ],
    'img-src': [
      'servedbyadbutler.com',
      'cdn.coinzilla.io',
    ],
    'font-src': [
      'request-global.czilladx.com',
    ],
  };
}
