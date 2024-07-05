import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  data: Pick<Address, 'name' | 'token' | 'is_contract'>;
  isLoading: boolean;
}

const AddressNameInfo = ({ data, isLoading }: Props) => {
  if (data.token) {
    return (
      <>
        <DetailsInfoItem.Label
          hint="Token name and symbol"
          isLoading={ isLoading }
        >
          Token name
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          <TokenEntity
            token={ data.token }
            isLoading={ isLoading }
            noIcon
            noCopy
          />
        </DetailsInfoItem.Value>
      </>
    );
  }

  if (data.is_contract && data.name) {
    return (
      <>
        <DetailsInfoItem.Label
          hint="The name found in the source code of the Contract"
          isLoading={ isLoading }
        >
          Contract name
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          <Skeleton isLoaded={ !isLoading }>
            { data.name }
          </Skeleton>
        </DetailsInfoItem.Value>
      </>
    );
  }

  if (data.name) {
    return (
      <>
        <DetailsInfoItem.Label
          hint="The name of the validator"
          isLoading={ isLoading }
        >
          Validator name
        </DetailsInfoItem.Label>
        <DetailsInfoItem.Value>
          <Skeleton isLoaded={ !isLoading }>
            { data.name }
          </Skeleton>
        </DetailsInfoItem.Value>
      </>
    );
  }

  return null;
};

export default React.memo(AddressNameInfo);
