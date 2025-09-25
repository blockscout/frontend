import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { isAddress } from 'viem';
import { type Chain } from 'viem';
import * as viemChains from 'viem/chains';
import { usePublicClient, createConfig, http } from 'wagmi';

import essentialDappsChains from 'configs/essentialDappsChains';

import searchAllowances from '../lib/searchAllowances';
import allowancesStub from '../lib/stubs/allowances';

const allChains = Object.values(viemChains);

function createWagmiConfig(chainId: number) {
  const chain = allChains.find((c) => c.id === chainId);
  const explorerUrl = essentialDappsChains[chainId];

  if (!chain || !explorerUrl) {
    return undefined;
  }

  return createConfig({
    chains: [ chain as Chain ],
    transports: {
      [chain.id]: http(`${ explorerUrl }/api/eth-rpc`, { batch: { wait: 100, batchSize: 5 } }),
    },
  });
}

export default function useApprovalsQuery(chainId: number, userAddress: string) {
  const config = useMemo(() => createWagmiConfig(chainId), [ chainId ]);
  const publicClient = usePublicClient({ chainId, config });

  return useQuery({
    queryKey: [ 'revoke:approvals', userAddress, publicClient ],
    queryFn: async() => {
      return searchAllowances(publicClient, userAddress);
    },
    enabled: Boolean(userAddress) && isAddress(userAddress),
    placeholderData: allowancesStub,
  });
}
