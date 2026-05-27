// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type CspDev from 'csp-dev';

export function rollbar(): CspDev.DirectiveDescriptor {
  if (!config.features.rollbar.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      'api.rollbar.com',
    ],
  };
}
