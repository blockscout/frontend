// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type CspDev from 'csp-dev';

import { KEY_WORDS } from '../utils';

export function helia(): CspDev.DirectiveDescriptor {
  if (!config.slices.token.nft.verifiedFetch.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      'https://delegated-ipfs.dev',
      'https://trustless-gateway.link',
    ],
    'img-src': [
      KEY_WORDS.BLOB,
    ],
  };
}
