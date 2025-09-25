import { useQuery } from '@tanstack/react-query';
import { isAddress, formatUnits } from 'viem';
import { usePublicClient } from 'wagmi';

import essentialDappsChains from 'configs/essentialDappsChains';

export default function useCoinBalanceQuery(chainId: number, userAddress: string) {
  const publicClient = usePublicClient({ chainId });

  return useQuery({
    queryKey: [ 'revoke:coin-balance', userAddress, publicClient ],
    queryFn: async() => {
      if (!chainId) return;

      const explorerUrl = essentialDappsChains[chainId];

      const [ balanceResponse, statsResponse ] = await Promise.all([
        fetch(`${ explorerUrl }/api/v2/addresses/${ userAddress }`),
        fetch(`${ explorerUrl }/api/v2/stats`),
      ]);

      const balanceData = (await balanceResponse.json()) as {
        coin_balance: string | null;
        exchange_rate: string | null;
      };

      const statsData = (await statsResponse.json()) as {
        coin_image: string | null;
      };

      const coinImage = statsData.coin_image || undefined;

      let balance = parseFloat(
        formatUnits(
          BigInt(balanceData.coin_balance || '0'),
          publicClient?.chain.nativeCurrency.decimals || 18,
        ),
      );

      const balanceUsd = Number(
        (balance * parseFloat(balanceData.exchange_rate || '0')).toFixed(2),
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
        balance: balanceString || '0',
        balanceUsd,
        symbol: publicClient?.chain.nativeCurrency.symbol,
        coinImage,
      };
    },
    enabled:
      Boolean(userAddress) &&
      isAddress(userAddress) &&
      Boolean(chainId),
    placeholderData: {
      balance: '10000',
      balanceUsd: '10000',
      symbol: 'ETH',
      coinImage: undefined,
    },
  });
}
