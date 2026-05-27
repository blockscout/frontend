// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import React from 'react';

import { useMultichainContext } from 'client/features/multichain/context';

import { getHexadecimalChainId } from '../utils/get-hexadecimal-chain-id';
import useProvider from './useProvider';

function getParams(chainConfig: typeof config): { chainId: string } {
  if (!chainConfig.chain.id) {
    throw new Error('Missing required chain config');
  }

  return { chainId: getHexadecimalChainId(Number(chainConfig.chain.id)) };
}

interface Params {
  chainConfig?: typeof config;
}

export default function useSwitchChain(params?: Params) {
  const { data: { wallet, provider } = {} } = useProvider();
  const multichainContext = useMultichainContext();

  const chainConfig = params?.chainConfig || multichainContext?.chain.app_config || config;

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
