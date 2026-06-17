// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { ADDRESS_INFO } from 'src/slices/address/stubs/address';
import { toAddressModel } from 'src/slices/address/utils/model';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

interface Props {
  hash: string;
}

const TokenInstanceCreatorAddress = ({ hash }: Props) => {
  const addressQuery = useApiQuery('core:address', {
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

  const creatorAddress = toAddressModel({
    hash: addressQuery.data.creator_address_hash,
    filecoin: addressQuery.data.creator_filecoin_robust_address ? {
      robust: addressQuery.data.creator_filecoin_robust_address,
      actor_type: null,
      id: null,
    } : undefined,
    is_contract: false,
  });

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
