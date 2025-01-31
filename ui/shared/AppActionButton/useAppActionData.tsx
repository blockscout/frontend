import { useMemo } from 'react';

import useAddressMetadataInfoQuery from 'lib/address/useAddressMetadataInfoQuery';

export default function useAppActionData(address: string | undefined = '', isEnabled = true) {
  const memoizedArray = useMemo(() => address ? [ address ] : [], [ address ]);
  const { data } = useAddressMetadataInfoQuery(memoizedArray, isEnabled);
  const metadata = data?.addresses[address?.toLowerCase()];
  const tag = metadata?.tags?.find(({ tagType }) => tagType === 'protocol');
  if (tag?.meta?.appMarketplaceURL || tag?.meta?.appID) {
    return tag.meta;
  }
  return null;
}
