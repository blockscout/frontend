import type CspDev from 'csp-dev';

import appConfig from 'configs/app/config';

export default function generateWalletConnectDescriptor(): CspDev.DirectiveDescriptor {
  if (!appConfig.walletConnect.projectId || !appConfig.network.rpcUrl) {
    return {};
  }

  return {
    'connect-src': [
      '*.walletconnect.com',
      'wss://*.bridge.walletconnect.org',
      'wss://www.walletlink.org',
    ],
    'img-src': [
      '*.walletconnect.com',
    ],
  };
}
