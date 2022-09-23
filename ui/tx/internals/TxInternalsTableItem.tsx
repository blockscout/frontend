import { Tr, Td, Tag, Icon, Box } from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';
import TxStatus from 'ui/tx/TxStatus';

interface Props {
  type: string;
  status: 'success' | 'error';
  from: string;
  to: string;
  value: number;
  gasLimit: number;
}

const TxInternalTableItem = ({ type, status, from, to, value, gasLimit }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;

  return (
    <Tr alignItems="top">
      <Td>
        { typeTitle && (
          <Box w="126px" display="inline-block">
            <Tag colorScheme="cyan" mr={ 5 }>{ typeTitle }</Tag>
          </Box>
        ) }
        <TxStatus status={ status }/>
      </Td>
      <Td>
        <Address>
          <AddressIcon hash={ from }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from } flexGrow={ 1 }/>
        </Address>
      </Td>
      <Td px={ 0 }>
        <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500"/>
      </Td>
      <Td>
        <Address>
          <AddressIcon hash={ to }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ to }/>
        </Address>
      </Td>
      <Td isNumeric>
        { value }
      </Td>
      <Td isNumeric>
        { gasLimit.toLocaleString('en') }
      </Td>
    </Tr>
  );
};

export default React.memo(TxInternalTableItem);
