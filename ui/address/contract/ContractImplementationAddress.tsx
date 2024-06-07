import { Box, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { Address as TAddress } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import ContainerWithScrollY from 'ui/shared/ContainerWithScrollY';
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
      <Box position="relative" maxW="100%">
        <ContainerWithScrollY
          gradientHeight={ 24 }
          rowGap={ 2 }
          maxH="150px"
        >
          { data.implementations.map((item) => (
            <AddressEntity
              key={ item.address }
              address={{ hash: item.address, is_contract: true }}
              noIcon
              noCopy
            />
          )) }
        </ContainerWithScrollY>
      </Box>
    </Flex>
  );
};

export default React.memo(ContractImplementationAddress);
