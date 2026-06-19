// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

export function mixpanel(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  if (!config.services.mixpanel.projectToken || isPrivateMode) {
    return {};
  }

  return {
    'connect-src': [
      '*.mixpanel.com',
    ],
  };
}
