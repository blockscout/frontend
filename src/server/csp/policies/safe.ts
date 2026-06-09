// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

export function safe(): CspDev.DirectiveDescriptor {
  if (!config.features.safe.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      '*.safe.global',
    ],
  };
}
