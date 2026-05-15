// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import { ADDRESS_INFO } from 'client/slices/address/stubs/address';

import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

interface Props {
  hash: string;
}

const TokenInstanceCreatorAddress = ({ hash }: Props) => {
  const addressQuery = useApiQuery('general:address', {
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
    filecoin: {
      robust: addressQuery.data.creator_filecoin_robust_address,
    },
    is_contract: false,
    implementations: null,
  };

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Address that deployed this token contract"
        isLoading={ addressQuery.isPlaceholderData }
      >
        Creator
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AddressEntity
          address={ creatorAddress }
          isLoading={ addressQuery.isPlaceholderData }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default TokenInstanceCreatorAddress;
