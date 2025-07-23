import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

export function useAddressClusters(addressHash: string, isEnabled: boolean = true) {
  return useApiQuery('clusters:get_clusters_by_address', {
    queryParams: {
      input: JSON.stringify({
        address: addressHash,
      }),
    },
    queryOptions: {
      enabled: Boolean(addressHash) && config.features.clusters.isEnabled && isEnabled,
    },
  });
}
