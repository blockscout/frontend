import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { getAbiItem } from 'viem';
import type { GetLogsParameters, PublicClient } from 'viem';

import { getApprovalEvents } from './logs';
import searchERC20Allowances from './searchErc20Allowances';
import searchNftAllowances from './searchNftAllowances';

export default async function searchAllowances(
  publicClient: PublicClient | undefined,
  searchQuery: string,
) {
  if (!publicClient) return [];
  try {
    const approvalEvents = await getApprovalEvents(
      {
        event: getAbiItem({ abi: ERC20Artifact.abi, name: 'Approval' }),
        args: { owner: searchQuery },
      } as unknown as GetLogsParameters,
      publicClient,
    );

    const erc20Allowances = await searchERC20Allowances(
      searchQuery,
      approvalEvents,
      publicClient,
    );
    const nftAllowances = await searchNftAllowances(
      searchQuery,
      approvalEvents,
      publicClient,
    );

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
