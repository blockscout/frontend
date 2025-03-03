import React from 'react';

import config from 'configs/app';

import useProvider from './useProvider';
import { getHexadecimalChainId } from './utils';

function getParams(): { chainId: string } {
  if (!config.chain.id) {
    throw new Error('Missing required chain config');
  }

  return { chainId: getHexadecimalChainId(Number(config.chain.id)) };
}

export default function useSwitchChain() {
  const { wallet, provider } = useProvider();

  return React.useCallback(() => {
    if (!wallet || !provider) {
      throw new Error('Wallet or provider not found');
    }

    return provider.request({
      method: 'wallet_switchEthereumChain',
      params: [ getParams() ],
    });
  }, [ wallet, provider ]);
}
