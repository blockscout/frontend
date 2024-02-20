import { useQueryClient } from '@tanstack/react-query';
import type { Abi } from 'abitype';
import React from 'react';

import type { Address } from 'types/api/address';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';

interface Params {
  addressHash?: string;
  isProxy?: boolean;
  isCustomAbi?: boolean;
}

export default function useContractAbi({ addressHash, isProxy, isCustomAbi }: Params): Abi | undefined {
  const queryClient = useQueryClient();

  const { data: contractInfo } = useApiQuery('contract', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      refetchOnMount: false,
    },
  });

  const addressInfo = queryClient.getQueryData<Address>(getResourceKey('address', {
    pathParams: { hash: addressHash },
  }));

  const { data: proxyInfo } = useApiQuery('contract', {
    pathParams: { hash: addressInfo?.implementation_address || '' },
    queryOptions: {
      enabled: Boolean(addressInfo?.implementation_address),
      refetchOnMount: false,
    },
  });

  const { data: customInfo } = useApiQuery('contract_methods_write', {
    pathParams: { hash: addressHash },
    queryParams: { is_custom_abi: 'true' },
    queryOptions: {
      enabled: Boolean(addressInfo?.has_custom_methods_write),
      refetchOnMount: false,
    },
  });

  return React.useMemo(() => {
    if (isProxy) {
      return proxyInfo?.abi ?? undefined;
    }

    if (isCustomAbi) {
      return customInfo as Abi;
    }

    return contractInfo?.abi ?? undefined;
  }, [ contractInfo?.abi, customInfo, isCustomAbi, isProxy, proxyInfo?.abi ]);
}
