// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type CspDev from 'csp-dev';

export function mixpanel(): CspDev.DirectiveDescriptor {
  if (!config.features.mixpanel.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      '*.mixpanel.com',
    ],
  };
}
