import type CspDev from 'csp-dev';

import config from 'configs/app';

const feature = config.features.saveOnGas;

export function gasHawk(): CspDev.DirectiveDescriptor {
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

  if (!apiOrigin) {
    return {};
  }

  return {
    'connect-src': [
      apiOrigin,
    ],
  };
}
