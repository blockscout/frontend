import { Tr, Td, Tag, Flex, Icon } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
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
          <Address hash={ from }>
            <AddressIcon/>
            <AddressLink ml={ 2 } fontWeight="500">
              <HashStringShortenDynamic/>
            </AddressLink>
          </Address>
          <Icon as={ rightArrowIcon } boxSize={ 6 } mx={ 2 } color="gray.500"/>
        </Flex>
      </Td>
      <Td pl="0">
        <Flex alignItems="center">
          <Address hash={ to }>
            <AddressIcon/>
            <AddressLink ml={ 2 } fontWeight="500">
              <HashStringShortenDynamic/>
            </AddressLink>
          </Address>
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
