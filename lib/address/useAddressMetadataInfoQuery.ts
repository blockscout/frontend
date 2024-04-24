import _mapKeys from 'lodash/mapKeys';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

export default function useAddressMetadataInfoQuery(addresses: Array<string>) {
  return useApiQuery('address_metadata_info', {
    fetchParams: {
      method: 'POST',
      body: {
        addresses,
        chainId: config.chain.id,
        tags: { limit: '20' },
      },
    },
    queryOptions: {
      enabled: addresses.length > 0 && config.features.addressMetadata.isEnabled,
      select: (data) => {
        const addresses = _mapKeys(data.addresses, (_, address) => address.toLowerCase());

        return { addresses };
      },
    },
  });
}
