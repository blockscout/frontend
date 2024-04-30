import { useQuery } from '@tanstack/react-query';

import type { AddressMetadataInfo } from 'types/api/addressMetadata';
import type { AddressMetadataInfoFormatted, AddressMetadataTagFormatted } from 'types/client/addressMetadata';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';

import parseMetaPayload from './parseMetaPayload';

export default function useAddressMetadataInfoQuery(addresses: Array<string>) {

  const apiFetch = useApiFetch();

  const queryParams = {
    addresses,
    chainId: config.chain.id,
    tagsLimit: '20',
  };
  const resource = 'address_metadata_info';

  // TODO @tom2drum: Improve the typing here
  // since we are formatting the API data in the select function here
  // we cannot use the useApiQuery hook because of its current typing
  // enhance useApiQuery so it can accept an API data and the formatted data types
  return useQuery<AddressMetadataInfo, unknown, AddressMetadataInfoFormatted>({
    queryKey: getResourceKey(resource, { queryParams }),
    queryFn: async() => {
      return apiFetch(resource, { queryParams }) as Promise<AddressMetadataInfo>;
    },
    enabled: addresses.length > 0 && config.features.addressMetadata.isEnabled,
    select: (data) => {
      const addresses = Object.entries(data.addresses)
        .map(([ address, { tags, reputation } ]) => {
          const formattedTags: Array<AddressMetadataTagFormatted> = tags.map((tag) => ({ ...tag, meta: parseMetaPayload(tag.meta) }));
          return [ address.toLowerCase(), { tags: formattedTags, reputation } ] as const;
        })
        .reduce((result, item) => {
          result[item[0]] = item[1];
          return result;
        }, {} as AddressMetadataInfoFormatted['addresses']);

      return { addresses };
    },
  });
}
