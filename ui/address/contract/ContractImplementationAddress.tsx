import { Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { Address as TAddress } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  hash: string | undefined;
}

const ContractImplementationAddress = ({ hash }: Props) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<TAddress>(getResourceKey('address', {
    pathParams: { hash },
  }));

  if (!data?.implementations || data.implementations.length === 0) {
    return null;
  }

  const label = data.implementations.length > 1 ? 'Implementation addresses:' : 'Implementation address:';

  return (
    <Flex mb={ 6 } flexWrap="wrap" columnGap={ 2 } rowGap={ 2 }>
      <span>{ label }</span>
      <Flex flexDir="column" rowGap={ 2 } maxW="100%">
        { data.implementations.map((item) => (
          <AddressEntity
            key={ item.address }
            address={{ hash: item.address, is_contract: true }}
            noIcon
            noCopy
          />
        )) }
      </Flex>
    </Flex>
  );
};

export default React.memo(ContractImplementationAddress);
