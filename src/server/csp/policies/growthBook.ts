// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

export function growthBook(): CspDev.DirectiveDescriptor {
  if (!config.services.growthBook.clientKey) {
    return {};
  }

  return {
    'connect-src': [
      'cdn.growthbook.io',
    ],
  };
}
