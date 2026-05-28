// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'client/config';

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
