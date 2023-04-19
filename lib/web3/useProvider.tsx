import React from 'react';

import type { ExternalProvider } from 'types/client/wallets';

import appConfig from 'configs/app/config';

export default function useProvider() {
  const [ provider, setProvider ] = React.useState<ExternalProvider>();

  React.useEffect(() => {
    if (!('ethereum' in window)) {
      return;
    }

    window.ethereum?.providers?.forEach(async(provider) => {
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
