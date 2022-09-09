import { Tr, Td, Tag, Flex, Icon } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
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
  return (
    <Tr alignItems="top">
      <Td>
        <Tag colorScheme="cyan" mr={ 2 }>{ capitalize(type) }</Tag>
        <TxStatus status={ status }/>
      </Td>
      <Td pr="0">
        <Flex alignItems="center">
          <AddressIcon address={ from }/>
          <AddressLinkWithTooltip address={ from } fontWeight="500" withCopy={ false } ml={ 2 }/>
          <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
        </Flex>
      </Td>
      <Td pl="0">
        <Flex alignItems="center">
          <AddressIcon address={ to }/>
          <AddressLinkWithTooltip address={ to } fontWeight="500" withCopy={ false } ml={ 2 }/>
        </Flex>
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
