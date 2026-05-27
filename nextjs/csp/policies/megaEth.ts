// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type CspDev from 'csp-dev';

const feature = config.features.megaEth;

export function megaEth(): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      feature.socketUrl.metrics,
      feature.socketUrl.rpc,
    ].filter(Boolean),
  };
}
