import React from 'react';
import { formatUnits } from 'viem';

import type { ChainConfig } from 'types/multichain';

import useApiQuery from 'lib/api/useApiQuery';

const PLACEHOLDER_DATA = {
  balance: '10000',
  balanceUsd: '10000',
  symbol: 'ETH',
  coinImage: undefined,
};

export default function useCoinBalanceQuery(chain: ChainConfig | undefined, userAddress: string) {
  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash: userAddress },
    chain,
  });
  const statsQuery = useApiQuery('general:stats', { chain });

  return React.useMemo(() => {
    if (!addressQuery.data || !statsQuery.data) {
      return {
        isPlaceholderData: true,
        data: PLACEHOLDER_DATA,
      };
    }

    const coinImage = statsQuery.data.coin_image || undefined;

    let balance = parseFloat(
      formatUnits(
        BigInt(addressQuery.data.coin_balance || '0'),
        chain?.config.chain.currency.decimals || 18,
      ),
    );

    const balanceUsd = Number(
      (balance * parseFloat(addressQuery.data.exchange_rate || '0')).toFixed(2),
    ).toLocaleString();

    let balanceString;

    if (balance > 0) {
      balance = Number(
        balance >= 1 ? balance.toFixed(2) : balance.toPrecision(5),
      );
      const [ integer, decimal ] = balance.toString().split('.');
      balanceString = Number(integer).toLocaleString();
      balanceString += decimal ? `.${ decimal }` : '';
    }

    return {
      isPlaceholderData: false,
      data: {
        balance: balanceString || '0',
        balanceUsd,
        symbol: chain?.config.chain.currency.symbol,
        coinImage,
      },
    };
  }, [ addressQuery.data, statsQuery.data, chain?.config.chain.currency.decimals, chain?.config.chain.currency.symbol ]);
}
