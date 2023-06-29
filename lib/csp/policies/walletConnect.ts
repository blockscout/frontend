import type CspDev from 'csp-dev';

import appConfig from 'configs/app/config';

export function walletConnect(): CspDev.DirectiveDescriptor {
  if (!appConfig.walletConnect.projectId || !appConfig.network.rpcUrl) {
    return {};
  }

  return {
    'connect-src': [
      '*.walletconnect.com',
      'wss://relay.walletconnect.com',
      'wss://www.walletlink.org',
    ],
    'img-src': [
      '*.walletconnect.com',
    ],
  };
}
