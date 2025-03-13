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
      'api.web3modal.org',
      '*.walletconnect.com',
      'wss://relay.walletconnect.com',
      'wss://www.walletlink.org',
    ],
    'frame-ancestors': [
      "'self'",
      'http://localhost:*',
      'https://*.pages.dev',
      'https://*.vercel.app',
      'https://*.ngrok-free.app',
      'https://secure-mobile.walletconnect.com',
      'https://secure-mobile.walletconnect.org',
      '*.walletconnect.org',
      '*.walletconnect.com',
      'https://*.dbcscan.io',
      'https://test.dbcscan.io',
    ],
    'img-src': [KEY_WORDS.BLOB, '*.walletconnect.com', 'https://*.dbcscan.io', 'https://test.dbcscan.io'],
    'frame-src': ["'self'", 'https://secure.walletconnect.com', '*.walletconnect.com', '*.walletconnect.org'],
  };
}
