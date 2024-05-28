import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { AddressImplementation as TAddressImplementation } from 'types/api/addressParams';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  data: Array<TAddressImplementation>;
  isLoading?: boolean;
}

const AddressImplementation = ({ data, isLoading }: Props) => {
  const hasManyItems = data.length > 1;
  return (
    <>
      <DetailsInfoItem.Label
        hint={ `Implementation${ hasManyItems ? 's' : '' } address${ hasManyItems ? 'es' : '' } of the proxy contract` }
        isLoading={ isLoading }
      >
        { `Implementation${ hasManyItems ? 's' : '' }` }
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
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
      </DetailsInfoItem.Value>
    </>
  );
};

export default React.memo(AddressImplementation);
