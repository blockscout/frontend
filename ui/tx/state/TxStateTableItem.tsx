import { Tr, Td, Box } from '@chakra-ui/react';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';

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
        <Address py="3px">
          <AddressIcon address={ data.address } isLoading={ isLoading }/>
          <AddressLink
            type="address"
            hash={ data.address.hash }
            alias={ data.address.name }
            fontWeight="500"
            truncation="constant"
            ml={ 2 }
            isLoading={ isLoading }
          />
        </Address>
      </Td>
      <Td isNumeric><Box py="7px">{ before }</Box></Td>
      <Td isNumeric><Box py="7px">{ after }</Box></Td>
      <Td isNumeric><Box py="7px">{ change }</Box></Td>
      <Td>{ tokenId }</Td>
    </Tr>
  );
};

export default React.memo(TxStateTableItem);
