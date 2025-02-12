import type CspDev from 'csp-dev';

import config from 'configs/app';

const feature = config.features.marketplace;

export function marketplace(): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      'api' in feature ? feature.api.endpoint : '',
      feature.rating ? 'https://api.airtable.com' : '',
    ],

    'frame-src': [
      '*',
    ],
  };
}
