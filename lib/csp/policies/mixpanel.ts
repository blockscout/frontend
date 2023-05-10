import type CspDev from 'csp-dev';

import appConfig from 'configs/app/config';

export function mixpanel(): CspDev.DirectiveDescriptor {
  if (!appConfig.mixpanel.projectToken) {
    return {};
  }

  return {
    'connect-src': [
      '*.mixpanel.com',
    ],
  };
}
