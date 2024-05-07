import useAddressMetadataInfoQuery from 'lib/address/useAddressMetadataInfoQuery';

export default function useAppActionData(address: string | undefined = '') {
  const { data } = useAddressMetadataInfoQuery([ address ]);
  const metadata = data?.addresses[address?.toLowerCase()];
  const tag = metadata?.tags?.find(({ tagType }) => tagType === 'protocol');
  if (tag?.meta?.actionURL || tag?.meta?.appID) {
    return tag.meta;
  }
  return null;
}
