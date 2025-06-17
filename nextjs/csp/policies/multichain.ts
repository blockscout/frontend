import type CspDev from 'csp-dev';

import * as multichainConfig from 'configs/multichain/config.edge';

export function multichain(): CspDev.DirectiveDescriptor {
  const value = multichainConfig.getValue();
  if (!value) {
    return {};
  }

  const apiEndpoints = value.chains.map((chain) => {
    return [
      ...Object.values(chain.config.apis).filter(Boolean).map((api) => api.endpoint),
      ...Object.values(chain.config.apis).filter(Boolean).map((api) => api.socketEndpoint),
    ].filter(Boolean);
  }).flat();

  const rpcEndpoints = value.chains.map(({ config }) => config.chain.rpcUrls).flat();

  return {
    'connect-src': [
      ...apiEndpoints,
      ...rpcEndpoints,
    ],
  };
}
