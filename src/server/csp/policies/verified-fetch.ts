// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

import { KEY_WORDS } from '../utils';

export function verifiedFetch(): CspDev.DirectiveDescriptor {
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
