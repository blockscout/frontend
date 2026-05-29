// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'client/config';

export function rollbar(): CspDev.DirectiveDescriptor {
  if (!config.services.rollbar.clientToken) {
    return {};
  }

  return {
    'connect-src': [
      'api.rollbar.com',
    ],
  };
}
