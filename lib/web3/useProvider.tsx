import React from 'react';

import type { WalletType } from 'types/client/wallets';
import type { WalletProvider } from 'types/web3';

import config from 'configs/app';

const feature = config.features.web3Wallet;

export default function useProvider() {
  const [ provider, setProvider ] = React.useState<WalletProvider>();
  const [ wallet, setWallet ] = React.useState<WalletType>();

  const initializeProvider = React.useMemo(() => async() => {
    if (!feature.isEnabled) {
      return;
    }

    if (!('ethereum' in window && window.ethereum)) {
      if (feature.wallets.includes('metamask') && window.navigator.userAgent.includes('Firefox')) {
        const { WindowPostMessageStream } = (await import('@metamask/post-message-stream'));
        const { initializeProvider } = (await import('@metamask/providers'));

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
          // some wallets (e.g TokenPocket, Liquality, etc) try to look like MetaMask but they are not (not even close)
          // so we have to check in addition the presence of the provider._events property
          // found this hack in wagmi repo
          // https://github.com/wagmi-dev/wagmi/blob/399b9eab8cfd698b49bfaa8456598dad9b597e0e/packages/connectors/src/types.ts#L65
          // for now it's the only way to distinguish them
          (wallet === 'metamask' && provider.isMetaMask && Boolean(provider._events)) ||
          (wallet === 'coinbase' && provider.isCoinbaseWallet) ||
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

  React.useEffect(() => {
    initializeProvider();
  }, [ initializeProvider ]);

  return { provider, wallet };
}
