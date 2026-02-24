import type CspDev from 'csp-dev';

import config from 'configs/app';
const feature = config.features.usercentrics;

export function usercentrics(): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  let scriptOrigin: string;
  try {
    scriptOrigin = new URL(feature.scriptUrl).origin;
  } catch {
    return {};
  }

  return {
    'script-src': [
      scriptOrigin,
      'https://web.cmp.usercentrics.eu/',
    ],
    'connect-src': [
      scriptOrigin,
      'https://api.usercentrics.eu/',
      'https://web.cmp.usercentrics.eu/',
      'https://v1.api.service.cmp.usercentrics.eu/',
      'https://consent-api.service.consent.usercentrics.eu/',
    ],
  };
}
