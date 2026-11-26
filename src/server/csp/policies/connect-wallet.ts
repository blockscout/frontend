// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

import { KEY_WORDS } from '../utils';

const feature = config.features.connectWallet;

export function connectWallet(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled || isPrivateMode) {
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
