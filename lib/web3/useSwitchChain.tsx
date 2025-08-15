import React from 'react';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';

import useProvider from './useProvider';
import { getHexadecimalChainId } from './utils';

function getParams(chainConfig: typeof config): { chainId: string } {
  if (!chainConfig.chain.id) {
    throw new Error('Missing required chain config');
  }

  return { chainId: getHexadecimalChainId(Number(chainConfig.chain.id)) };
}

export default function useSwitchChain() {
  const { wallet, provider } = useProvider();
  const multichainContext = useMultichainContext();

  const chainConfig = multichainContext?.chain.config ?? config;

  return React.useCallback(() => {
    if (!wallet || !provider) {
      throw new Error('Wallet or provider not found');
    }

    return provider.request({
      method: 'wallet_switchEthereumChain',
      params: [ getParams(chainConfig) ],
    });
  }, [ wallet, provider, chainConfig ]);
}
