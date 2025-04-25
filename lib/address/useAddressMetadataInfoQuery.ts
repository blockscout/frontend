import type { AddressMetadataInfoFormatted, AddressMetadataTagFormatted } from 'types/client/addressMetadata';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

import parseMetaPayload from './parseMetaPayload';

export default function useAddressMetadataInfoQuery(addresses: Array<string>, isEnabled = true) {

  const resource = 'metadata:info';

  return useApiQuery<typeof resource, unknown, AddressMetadataInfoFormatted>(resource, {
    queryParams: {
      addresses,
      chainId: config.chain.id,
      tagsLimit: '20',
    },
    queryOptions: {
      enabled: isEnabled && addresses.length > 0 && config.features.addressMetadata.isEnabled,
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
    },
  });
}
