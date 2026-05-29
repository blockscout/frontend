// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'client/config';

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
