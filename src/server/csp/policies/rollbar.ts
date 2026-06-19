// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

export function rollbar(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  if (!config.services.rollbar.clientToken || isPrivateMode) {
    return {};
  }

  return {
    'connect-src': [
      'api.rollbar.com',
    ],
  };
}
