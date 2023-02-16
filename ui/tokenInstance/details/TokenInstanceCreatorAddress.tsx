import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSkeletonRow from 'ui/shared/skeletons/DetailsSkeletonRow';

interface Props {
  hash: string;
}

const TokenInstanceCreatorAddress = ({ hash }: Props) => {
  const addressQuery = useApiQuery('address', {
    pathParams: { hash },
  });

  if (addressQuery.isError) {
    return null;
  }

  if (addressQuery.isLoading) {
    return <DetailsSkeletonRow w="30%"/>;
  }

  if (!addressQuery.data.creator_address_hash) {
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
    >
      <Address>
        <AddressIcon address={ creatorAddress }/>
        <AddressLink type="address" hash={ creatorAddress.hash } ml={ 2 }/>
        <CopyToClipboard text={ creatorAddress.hash }/>
      </Address>
    </DetailsInfoItem>
  );
};

export default TokenInstanceCreatorAddress;
