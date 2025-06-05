import type CspDev from 'csp-dev';

import multichainConfig from 'configs/multichain';

export function multichain(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      ...(multichainConfig?.chains || [])
        .map((chain) => {
          return [
            ...Object.values(chain.config.apis).filter(Boolean).map((api) => api.endpoint),
            chain.config.apis.general.socketEndpoint,
          ];
        }).flat(),
    ],
  };
}
