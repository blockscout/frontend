import type CspDev from 'csp-dev';

import config from 'configs/app';

import { KEY_WORDS } from '../utils';

export function walletConnect(): CspDev.DirectiveDescriptor {
  if (!config.features.blockchainInteraction.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      '*.web3modal.com',
      '*.web3modal.org',
      '*.walletconnect.com',
      '*.walletconnect.org',
      'wss://relay.walletconnect.com',
      'wss://relay.walletconnect.org',
      'wss://www.walletlink.org',
    ],
    'frame-ancestors': [
      '*.walletconnect.org',
      '*.walletconnect.com',
    ],
    'img-src': [
      KEY_WORDS.BLOB,
      '*.walletconnect.com',
    ],
  };
}
