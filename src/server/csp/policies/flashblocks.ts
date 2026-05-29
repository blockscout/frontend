// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

const flashblocksFeature = config.features.flashblocks;

export function flashblocks(): CspDev.DirectiveDescriptor {
  if (!flashblocksFeature.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      flashblocksFeature.socketUrl,
    ],
  };
}
