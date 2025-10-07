import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { getAbiItem } from 'viem';
import type { GetLogsParameters, PublicClient } from 'viem';

import createPublicClient from './createPublicClient';
import getLogs from './getLogs';
import searchERC20Allowances from './searchErc20Allowances';
import searchNftAllowances from './searchNftAllowances';

export default async function searchAllowances(
  chainId: number,
  searchQuery: string,
  signal?: AbortSignal,
) {
  try {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const publicClient = createPublicClient(chainId) as PublicClient;
    const latestBlockNumber = await publicClient.getBlockNumber();

    const filter = {
      event: getAbiItem({ abi: ERC20Artifact.abi, name: 'Approval' }),
      args: { owner: searchQuery },
    } as unknown as GetLogsParameters;
    const approvalEvents = await getLogs(publicClient, filter, BigInt(0), latestBlockNumber, signal);

    const [ erc20Allowances, nftAllowances ] = await Promise.all([
      searchERC20Allowances(chainId, searchQuery, approvalEvents, publicClient, signal),
      searchNftAllowances(chainId, searchQuery, approvalEvents, publicClient, latestBlockNumber, signal),
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
}
