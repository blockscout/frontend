import type CspDev from 'csp-dev';

import config from 'configs/app';

export function walletConnect(): CspDev.DirectiveDescriptor {
  if (!config.features.blockchainInteraction.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      '*.walletconnect.com',
      'wss://relay.walletconnect.com',
      'wss://www.walletlink.org',
    ],
    'img-src': [
      '*.walletconnect.com',
    ],
  };
}
