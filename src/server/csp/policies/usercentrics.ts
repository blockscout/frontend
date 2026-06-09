// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

export function usercentrics(): CspDev.DirectiveDescriptor {
  if (!config.services.usercentrics) {
    return {};
  }

  return {
    'script-src': [
      'https://web.cmp.usercentrics.eu',
    ],
    'connect-src': [
      'https://v1.api.service.cmp.usercentrics.eu/',
      'https://consent-api.service.consent.usercentrics.eu/',
      'https://consent-rt-ret.service.consent.usercentrics.eu',
      'https://graphql.usercentrics.eu',
    ],
    'frame-src': [
      'https://web.cmp.usercentrics.eu',
    ],
  };
}
