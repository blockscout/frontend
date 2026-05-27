// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type CspDev from 'csp-dev';

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
