import type CspDev from 'csp-dev';

import isSelfHosted from 'lib/isSelfHosted';

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
      '*.slise.xyz',
      // what hash is this?
      '\'sha256-wMOeDjJaOTjCfNjluteV+tSqHW547T89sgxd8W6tQJM=\'',
      // what hash is this?
      '\'sha256-FcyIn1h7zra8TVnnRhYrwrplxJW7dpD5TV7kP2AG/kI=\'',
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
