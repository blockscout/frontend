// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

const feature = config.features.addressProfileAPI;

export function addressProfileApi(): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  const apiOrigin = (() => {
    try {
      const url = new URL(feature.apiUrlTemplate);
      return url.origin;
    } catch (error) {
      return '';
    }
  })();

  return {
    'connect-src': [
      apiOrigin,
    ],
  };
}
