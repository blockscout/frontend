import { WindowPostMessageStream } from '@metamask/post-message-stream';
import { initializeProvider } from '@metamask/providers';
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
    if (!feature.isEnabled) {
      return;
    }

    if (!('ethereum' in window && window.ethereum)) {
      if (feature.wallets.includes('metamask') && window.navigator.userAgent.includes('Firefox')) {
        // workaround for MetaMask in Firefox
        // Firefox blocks MetaMask injection script because of our CSP for 'script-src'
        // so we have to inject it manually while the issue is not fixed
        // https://github.com/MetaMask/metamask-extension/issues/3133#issuecomment-1025641185
        const metamaskStream = new WindowPostMessageStream({
          name: 'metamask-inpage',
          target: 'metamask-contentscript',
        });

        // this will initialize the provider and set it as window.ethereum
        initializeProvider({
          connectionStream: metamaskStream as never,
          shouldShimWeb3: true,
        });
      } else {
        return;
      }
    }

    // have to check again in case provider was not set as window.ethereum in the previous step for MM in FF
    // and also it makes typescript happy
    if (!('ethereum' in window && window.ethereum)) {
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
