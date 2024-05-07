import { useMemo } from 'react';

import useAddressMetadataInfoQuery from 'lib/address/useAddressMetadataInfoQuery';

export default function useAppActionData(address: string | undefined = '') {
  const memoizedArray = useMemo(() => address ? [ address ] : [], [ address ]);
  const { data } = useAddressMetadataInfoQuery(memoizedArray);
  const metadata = data?.addresses[address?.toLowerCase()];
  const tag = metadata?.tags?.find(({ tagType }) => tagType === 'protocol');
  if (tag?.meta?.appMarketplaceURL || tag?.meta?.appID) {
    return tag.meta;
  }
  return null;
}
