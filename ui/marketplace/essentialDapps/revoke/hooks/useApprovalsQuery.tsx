import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';

import searchAllowances from '../lib/searchAllowances';
import allowancesStub from '../lib/stubs/allowances';

export default function useApprovalsQuery(chainId: number, userAddress: string) {
  return useQuery({
    queryKey: [ 'revoke:approvals', chainId, userAddress ],
    queryFn: ({ signal }) => searchAllowances(chainId, userAddress, signal),
    enabled: Boolean(userAddress) && isAddress(userAddress),
    placeholderData: allowancesStub,
  });
}
