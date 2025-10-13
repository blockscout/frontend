import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { PublicClient, GetLogsParameters } from 'viem';
import { isAddress, getAbiItem } from 'viem';

import type { ChainConfig } from 'types/multichain';

import { ALLOWANCES } from 'stubs/revoke';

import createPublicClient from '../lib/createPublicClient';
import getLogs from '../lib/getLogs';
import useSearchErc20Allowances from './useSearchErc20Allowances';
import useSearchNftAllowances from './useSearchNftAllowances';

export default function useApprovalsQuery(chain: ChainConfig | undefined, userAddress: string) {
  const searchErc20Allowances = useSearchErc20Allowances();
  const searchNftAllowances = useSearchNftAllowances();

  const searchAllowances = useCallback(async(
    chain: ChainConfig | undefined,
    searchQuery: string,
    signal?: AbortSignal,
  ) => {
    try {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      const publicClient = createPublicClient(chain?.config.chain.id) as PublicClient;
      const latestBlockNumber = await publicClient.getBlockNumber();

      const filter = {
        event: getAbiItem({ abi: ERC20Artifact.abi, name: 'Approval' }),
        args: { owner: searchQuery },
      } as unknown as GetLogsParameters;
      const approvalEvents = await getLogs(publicClient, filter, BigInt(0), latestBlockNumber, signal);

      const [ erc20Allowances, nftAllowances ] = await Promise.all([
        searchErc20Allowances(chain, searchQuery, approvalEvents, publicClient, signal),
        searchNftAllowances(chain, searchQuery, approvalEvents, publicClient, latestBlockNumber, signal),
      ]);

      const allowances = [ ...erc20Allowances, ...nftAllowances ].sort((a, b) => {
        if (b.timestamp < a.timestamp) return -1;
        if (b.timestamp > a.timestamp) return 1;
        return 0;
      });

      return allowances;
    } catch {
      return [];
    }
  }, [ searchErc20Allowances, searchNftAllowances ]);

  return useQuery({
    queryKey: [ 'revoke:approvals', chain?.config.chain.id, userAddress ],
    queryFn: ({ signal }) => searchAllowances(chain, userAddress, signal),
    enabled: Boolean(userAddress) && isAddress(userAddress),
    placeholderData: ALLOWANCES,
  });
}
