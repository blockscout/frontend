import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { AddressImplementation as TAddressImplementation } from 'types/api/addressParams';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  data: Array<TAddressImplementation>;
  isLoading?: boolean;
}

const AddressImplementation = ({ data, isLoading }: Props) => {
  const hasManyItems = data.length > 1;
  return (
    <DetailsInfoItem
      title={ `Implementation${ hasManyItems ? 's' : '' }` }
      hint={ `Implementation${ hasManyItems ? 's' : '' } address${ hasManyItems ? 'es' : '' } of the proxy contract` }
      isLoading={ isLoading }
    >
      <Flex flexDir="column" rowGap={ 2 }>
        { data.map((item) => (
          <AddressEntity
            key={ item.address }
            address={{ hash: item.address, name: item.name, is_contract: true }}
            isLoading={ isLoading }
            noIcon
          />
        )) }
      </Flex>
    </DetailsInfoItem>
  );
};

export default React.memo(AddressImplementation);
