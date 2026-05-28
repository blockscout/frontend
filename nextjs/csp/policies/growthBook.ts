// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'client/config';

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
