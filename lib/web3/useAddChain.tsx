import React from 'react';
import type { AddEthereumChainParameter } from 'viem';

import config from 'configs/app';
import { SECOND } from 'toolkit/utils/consts';

import useRewardsActivity from '../hooks/useRewardsActivity';
import useProvider from './useProvider';
import { getHexadecimalChainId } from './utils';

function getParams(): AddEthereumChainParameter {
  if (!config.chain.id) {
    throw new Error('Missing required chain config');
  }

  return {
    chainId: getHexadecimalChainId(Number(config.chain.id)),
    chainName: config.chain.name ?? '',
    nativeCurrency: {
      name: config.chain.currency.name ?? '',
      symbol: config.chain.currency.symbol ?? '',
      decimals: config.chain.currency.decimals ?? 18,
    },
    rpcUrls: config.chain.rpcUrls,
    blockExplorerUrls: [ config.app.baseUrl ],
  };
}

export default function useAddChain() {
  const { wallet, provider } = useProvider();
  const { trackUsage } = useRewardsActivity();

  return React.useCallback(async() => {
    if (!wallet || !provider) {
      throw new Error('Wallet or provider not found');
    }

    const start = Date.now();

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [ getParams() ],
    });

    // if network is already added, the promise resolves immediately
    if (Date.now() - start > SECOND) {
      await trackUsage('add_network');
    }
  }, [ wallet, provider, trackUsage ]);
}
