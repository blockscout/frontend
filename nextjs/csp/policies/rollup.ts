// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type CspDev from 'csp-dev';

const rollupFeature = config.features.rollup;

export function rollup(): CspDev.DirectiveDescriptor {
  if (!rollupFeature.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      ...(rollupFeature.parentChain.rpcUrls ?? []),
    ],
  };
}
