// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type CspDev from 'csp-dev';

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
