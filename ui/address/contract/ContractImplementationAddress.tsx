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

  if (!data?.implementation_address) {
    return null;
  }

  return (
    <Flex mb={ 6 } flexWrap="wrap" columnGap={ 2 }>
      <span>Implementation address:</span>
      <AddressEntity address={{ hash: data.implementation_address, is_contract: true }} noIcon noCopy/>
    </Flex>
  );
};

export default React.memo(ContractImplementationAddress);
