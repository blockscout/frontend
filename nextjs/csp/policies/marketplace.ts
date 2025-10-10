import type CspDev from 'csp-dev';

import config from 'configs/app';
import * as essentialDappsChains from 'configs/essential-dapps-chains/config.edge';

const feature = config.features.marketplace;

export function marketplace(): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled) {
    return {};
  }

  const posthogHost = feature.essentialDapps?.multisend?.posthogHost ? '*.posthog.com' : '';
  const chainsConfig = feature.essentialDapps && essentialDappsChains.getValue();
  const externalApiEndpoints = chainsConfig?.chains.map((chain) => chain.config.apis.general?.endpoint).filter(Boolean);
  const defaultRpcUrls = chainsConfig?.chains.map((chain) => chain.config.chain.rpcUrls).flat();

  return {
    'connect-src': [
      'api' in feature ? feature.api.endpoint : '',
      ...(feature.essentialDapps ? [
        'https://li.quest/',
        'https://*.multisender.app/',
        posthogHost,
        ...(externalApiEndpoints ?? []),
        ...(defaultRpcUrls ?? []),
      ] : []),
    ],

    'frame-src': [
      '*',
    ],

    'script-src': [
      posthogHost,
    ],
  };
}
