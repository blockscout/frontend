import React from 'react';
import type { WindowProvider } from 'wagmi';

import 'wagmi/window';

import type { WalletType } from 'types/client/wallets';

import config from 'configs/app';

const feature = config.features.web3Wallet;

export default function useProvider() {
  const [ provider, setProvider ] = React.useState<WindowProvider>();
  const [ wallet, setWallet ] = React.useState<WalletType>();

  React.useEffect(() => {
    if (!('ethereum' in window && window.ethereum) || !feature.isEnabled) {
      return;
    }

    // if user has multiple wallets installed, they all are injected in the window.ethereum.providers array
    // if user has only one wallet, the provider is injected in the window.ethereum directly
    const providers = Array.isArray(window.ethereum.providers) ? window.ethereum.providers : [ window.ethereum ];

    for (const wallet of feature.wallets) {
      const provider = providers.find((provider) => {
        return (
          (wallet === 'coinbase' && provider.isCoinbaseWallet) ||
          (wallet === 'metamask' && provider.isMetaMask) ||
          (wallet === 'token_pocket' && provider.isTokenPocket)
        );
      });

      if (provider) {
        setProvider(provider);
        setWallet(wallet);
        break;
      }
    }
  }, []);

  return { provider, wallet };
}
