import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { ADDRESS_INFO } from 'stubs/address';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

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
      <AddressEntity
        address={ creatorAddress }
        isLoading={ addressQuery.isPlaceholderData }
      />
    </DetailsInfoItem>
  );
};

export default TokenInstanceCreatorAddress;
