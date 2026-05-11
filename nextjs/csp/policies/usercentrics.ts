import type CspDev from 'csp-dev';

import config from 'configs/app';
const feature = config.features.usercentrics;

export function usercentrics(): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  return {
    'script-src': [
      'https://web.cmp.usercentrics.eu',
    ],
    'connect-src': [
      'https://v1.api.service.cmp.usercentrics.eu/',
    ],
  };
}
