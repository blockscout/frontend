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
      'https://li.quest/', // TODO: check essential dapps feature
      'https://ethereum-rpc.publicnode.com/',
      'https://eth.drpc.org/',
      'https://registry.npmjs.org/',
      'https://*.multisender.app/',
    ],

    'frame-src': [
      '*',
    ],
  };
}
