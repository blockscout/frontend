// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import { VERIFIED_FETCH_GATEWAYS } from 'src/slices/token/utils/verified-fetch';

import config from 'src/config';

import { KEY_WORDS } from '../utils';

export function verifiedFetch(): CspDev.DirectiveDescriptor {
  if (!config.slices.token.nft.verifiedFetch.isEnabled) {
    return {};
  }

  return {
    'connect-src': VERIFIED_FETCH_GATEWAYS,
    'img-src': [
      KEY_WORDS.BLOB,
    ],
  };
}
