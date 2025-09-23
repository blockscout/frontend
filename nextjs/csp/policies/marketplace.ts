import type CspDev from 'csp-dev';

import config from 'configs/app';
import essentialDappsChains from 'configs/essentialDappsChains';

const feature = config.features.marketplace;

export function marketplace(): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      'api' in feature ? feature.api.endpoint : '',
      'https://li.quest/', // TODO: check essential dapps feature
      'https://registry.npmjs.org/',
      'https://*.multisender.app/',
      'https://chains.blockscout.com/',
      ...Object.values(essentialDappsChains).map((explorerUrl) => `${ explorerUrl }/api/`),
    ],

    'frame-src': [
      '*',
    ],
  };
}
