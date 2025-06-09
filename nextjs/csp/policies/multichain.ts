import type CspDev from 'csp-dev';

import appConfig from 'configs/app';
import * as multichainConfig from 'configs/multichain/config.edge';

export function multichain(): CspDev.DirectiveDescriptor {
  if (!appConfig.features.multichain.isEnabled) {
    return {};
  }

  const value = multichainConfig.getValue();
  const endpoints = (value?.chains || []).map((chain) => {
    return [
      ...Object.values(chain.config.apis).filter(Boolean).map((api) => api.endpoint),
      chain.config.apis.general.socketEndpoint,
    ];
  }).flat();

  return {
    'connect-src': endpoints,
  };
}
