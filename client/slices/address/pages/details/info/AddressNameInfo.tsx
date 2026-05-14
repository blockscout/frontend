// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Address } from 'client/slices/address/types/api';

import TokenEntity from 'client/slices/token/components/entity/TokenEntity';

import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

interface Props {
  data: Pick<Address, 'name' | 'token' | 'is_contract'>;
  isLoading?: boolean;
}

const AddressNameInfo = ({ data, isLoading }: Props) => {
  if (data.token) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint="Token name and symbol"
          isLoading={ isLoading }
        >
          Token name
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <TokenEntity
            token={ data.token }
            isLoading={ isLoading }
            noIcon
            noCopy
          />
        </DetailedInfo.ItemValue>
      </>
    );
  }

  if (data.is_contract && data.name) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint="The name found in the source code of the Contract"
          isLoading={ isLoading }
        >
          Contract name
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <Skeleton loading={ isLoading }>
            { data.name }
          </Skeleton>
        </DetailedInfo.ItemValue>
      </>
    );
  }

  if (data.name) {
    return (
      <>
        <DetailedInfo.ItemLabel
          hint="The name of the validator"
          isLoading={ isLoading }
        >
          Validator name
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <Skeleton loading={ isLoading }>
            { data.name }
          </Skeleton>
        </DetailedInfo.ItemValue>
      </>
    );
  }

  return null;
};

export default React.memo(AddressNameInfo);
