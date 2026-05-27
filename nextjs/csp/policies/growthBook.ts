// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type CspDev from 'csp-dev';

export function growthBook(): CspDev.DirectiveDescriptor {
  if (!config.features.growthBook.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      'cdn.growthbook.io',
    ],
  };
}
