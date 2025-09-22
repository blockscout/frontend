import { useQuery } from '@tanstack/react-query';
import { isAddress } from 'viem';
import { usePublicClient } from 'wagmi';

import searchAllowances from '../lib/searchAllowances';
import allowancesStub from '../lib/stubs/allowances';

export default function useApprovalsQuery(selectedNetwork: number, userAddress: string) {
  const publicClient = usePublicClient({ chainId: selectedNetwork });

  return useQuery({
    queryKey: [ 'revoke:approvals', userAddress, publicClient ],
    queryFn: async() => {
      return searchAllowances(publicClient, userAddress);
    },
    enabled: Boolean(userAddress) && isAddress(userAddress),
    placeholderData: allowancesStub,
  });
}
