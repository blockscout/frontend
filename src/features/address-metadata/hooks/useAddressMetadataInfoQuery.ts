// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressMetadataInfoFormatted, AddressMetadataTagFormatted } from 'src/features/address-metadata/types/client';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';

import parseMetaPayload from '../utils/parse-meta-payload';

export default function useAddressMetadataInfoQuery(addresses: Array<string>, isEnabled = true) {

  const resource = 'metadata:info';

  const multichainContext = useMultichainContext();
  const feature = multichainContext?.chain?.app_config.features.addressMetadata || config.features.addressMetadata;
  const chainId = multichainContext?.chain?.app_config.chain.id || config.chain.id;

  return useApiQuery<typeof resource, unknown, AddressMetadataInfoFormatted>(resource, {
    queryParams: {
      addresses,
      chainId,
      tagsLimit: '20',
    },
    queryOptions: {
      enabled: isEnabled && addresses.length > 0 && feature.isEnabled && Boolean(chainId),
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
