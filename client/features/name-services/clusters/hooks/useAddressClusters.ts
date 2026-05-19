// SPDX-License-Identifier: LicenseRef-Blockscout

import useApiQuery from 'client/api/hooks/useApiQuery';

import config from 'configs/app';

const feature = config.features.nameServices;

export function useAddressClusters(addressHash: string, isEnabled: boolean = true) {
  return useApiQuery('clusters:get_clusters_by_address', {
    queryParams: {
      input: JSON.stringify({
        address: addressHash,
      }),
    },
    queryOptions: {
      enabled: Boolean(addressHash) && feature.isEnabled && feature.clusters.isEnabled && isEnabled,
    },
  });
}
