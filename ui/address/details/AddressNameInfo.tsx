import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  data: Pick<Address, 'name' | 'token' | 'is_contract'>;
  isLoading: boolean;
}

const AddressNameInfo = ({ data, isLoading }: Props) => {
  if (data.token) {
    return (
      <DetailsInfoItem
        title="Token name"
        hint="Token name and symbol"
        isLoading={ isLoading }
      >
        <TokenEntity
          token={ data.token }
          isLoading={ isLoading }
          noIcon
          noCopy
        />
      </DetailsInfoItem>
    );
  }

  if (data.is_contract && data.name) {
    return (
      <DetailsInfoItem
        title="Contract name"
        hint="The name found in the source code of the Contract"
        isLoading={ isLoading }
      >
        <Skeleton isLoaded={ !isLoading }>
          { data.name }
        </Skeleton>
      </DetailsInfoItem>
    );
  }

  if (data.name) {
    return (
      <DetailsInfoItem
        title="Validator name"
        hint="The name of the validator"
        isLoading={ isLoading }
      >
        <Skeleton isLoaded={ !isLoading }>
          { data.name }
        </Skeleton>
      </DetailsInfoItem>
    );
  }

  return null;
};

export default React.memo(AddressNameInfo);
