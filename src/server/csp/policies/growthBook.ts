// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

export function growthbook(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  if (!config.services.growthBook.clientKey || isPrivateMode) {
    return {};
  }

  return {
    'connect-src': [
      'cdn.growthbook.io',
    ],
  };
}
