import { Tr, Td, Box } from '@chakra-ui/react';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import { getStateElements } from './utils';

interface Props {
  data: TxStateChange;
  isLoading?: boolean;
}

const TxStateTableItem = ({ data, isLoading }: Props) => {
  const { before, after, change, tag, tokenId } = getStateElements(data, isLoading);

  return (
    <Tr>
      <Td>
        <Box py="3px">
          { tag }
        </Box>
      </Td>
      <Td>
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
          py="7px"
        />
      </Td>
      <Td isNumeric><Box py="7px">{ before }</Box></Td>
      <Td isNumeric><Box py="7px">{ after }</Box></Td>
      <Td isNumeric><Box py="7px">{ change }</Box></Td>
      <Td>{ tokenId }</Td>
    </Tr>
  );
};

export default React.memo(TxStateTableItem);
