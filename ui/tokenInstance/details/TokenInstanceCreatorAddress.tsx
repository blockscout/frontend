import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { ADDRESS_INFO } from 'stubs/address';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  hash: string;
}

const TokenInstanceCreatorAddress = ({ hash }: Props) => {
  const addressQuery = useApiQuery('address', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: ADDRESS_INFO,
    },
  });

  if (addressQuery.isError) {
    return null;
  }

  if (!addressQuery.data?.creator_address_hash) {
    return null;
  }

  const creatorAddress = {
    hash: addressQuery.data.creator_address_hash,
    is_contract: false,
    implementation_name: null,
  };

  return (
    <DetailsInfoItem
      title="Creator"
      hint="Address that deployed this token contract"
      isLoading={ addressQuery.isPlaceholderData }
    >
      <Address>
        <AddressIcon address={ creatorAddress } isLoading={ addressQuery.isPlaceholderData }/>
        <AddressLink type="address" hash={ creatorAddress.hash } ml={ 2 } isLoading={ addressQuery.isPlaceholderData }/>
        <CopyToClipboard text={ creatorAddress.hash } isLoading={ addressQuery.isPlaceholderData }/>
      </Address>
    </DetailsInfoItem>
  );
};

export default TokenInstanceCreatorAddress;
