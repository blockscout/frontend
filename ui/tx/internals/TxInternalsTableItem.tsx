import { Tr, Td, Tag, Icon, Box } from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/east.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

interface Props {
  type: string;
  status: 'ok' | 'error' | null;
  from: { hash: string; alias?: string};
  to: { hash: string; alias?: string};
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
          <AddressIcon hash={ from.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.alias } flexGrow={ 1 }/>
        </Address>
      </Td>
      <Td px={ 0 }>
        <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500"/>
      </Td>
      <Td>
        <Address>
          <AddressIcon hash={ to.hash }/>
          <AddressLink hash={ to.hash } alias={ to.alias } fontWeight="500" ml={ 2 }/>
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
