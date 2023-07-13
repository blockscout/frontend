import React from 'react';
import type { WindowProvider } from 'wagmi';

import 'wagmi/window';

import appConfig from 'configs/app/config';

export default function useProvider() {
  const [ provider, setProvider ] = React.useState<WindowProvider>();

  React.useEffect(() => {
    if (!('ethereum' in window && window.ethereum)) {
      return;
    }

    // if user has multiple wallets installed, they all are injected in the window.ethereum.providers array
    // if user has only one wallet, the provider is injected in the window.ethereum directly
    const providers = Array.isArray(window.ethereum.providers) ? window.ethereum.providers : [ window.ethereum ];

    providers.forEach(async(provider) => {
      if (appConfig.web3.defaultWallet === 'coinbase' && provider.isCoinbaseWallet) {
        return setProvider(provider);
      }

      if (appConfig.web3.defaultWallet === 'metamask' && provider.isMetaMask) {
        return setProvider(provider);
      }
    });
  }, []);

  return provider;
}
