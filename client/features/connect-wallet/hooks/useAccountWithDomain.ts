// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import config from 'configs/app';

import useAccount from './useAccount';

const feature = config.features.nameServices;

export default function useAccountWithDomain(isEnabled: boolean) {
  const { address, isConnecting } = useAccount();

  const isQueryEnabled = feature.isEnabled && feature.ens.isEnabled && Boolean(address) && Boolean(isEnabled);

  const domainQuery = useApiQuery('bens:address_domain', {
    pathParams: {
      address,
    },
    queryParams: {
      protocols: feature.isEnabled && feature.ens.isEnabled ? feature.ens.protocols : undefined,
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
      isLoading: (isQueryEnabled && domainQuery.isLoading) || isConnecting,
    };
  }, [ address, domainQuery.data?.domain?.name, domainQuery.isLoading, isEnabled, isQueryEnabled, isConnecting ]);
}
