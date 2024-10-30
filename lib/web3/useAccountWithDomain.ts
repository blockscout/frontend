import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

import useAccount from './useAccount';

export default function useAccountWithDomain(isEnabled: boolean) {
  const { address } = useAccount();

  const isQueryEnabled = config.features.nameService.isEnabled && Boolean(address) && Boolean(isEnabled);

  const domainQuery = useApiQuery('address_domain', {
    pathParams: {
      chainId: config.chain.id,
      address,
    },
    queryOptions: {
      enabled: isQueryEnabled,
      refetchOnMount: false,
    },
  });

  return React.useMemo(() => {
    return {
      address: isEnabled ? address : undefined,
      domain: domainQuery.data?.domain?.name,
      isLoading: isQueryEnabled && domainQuery.isLoading,
    };
  }, [ address, domainQuery.data?.domain?.name, domainQuery.isLoading, isEnabled, isQueryEnabled ]);
}
