import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityWithTokenFilter from 'ui/shared/entities/address/AddressEntityWithTokenFilter';

import AddressFromToIcon from './AddressFromToIcon';

interface Props {
  to: Pick<
  AddressParam,
  | 'hash'
  | 'name'
  | 'is_contract'
  | 'is_verified'
  | 'implementation_name'
  | 'ens_domain_name'
  >;
  isLoading?: boolean;
  tokenHash?: string;
}

const AddressTo = ({ to, isLoading, tokenHash = '' }: Props) => {

  const Entity = tokenHash ? AddressEntityWithTokenFilter : AddressEntity;

  return (
    <Flex gap={ 5 }>
      <AddressFromToIcon isLoading={ isLoading }/>
      <Entity
        address={ to }
        isLoading={ isLoading }
        tokenHash={ tokenHash }
        truncation="constant"
        ml={ 3 }
      />
    </Flex>
  );
};

export default chakra(AddressTo);
