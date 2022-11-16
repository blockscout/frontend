import { Tr, Td, Tag, Icon, Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import rightArrowIcon from 'icons/arrows/east.svg';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/shared/TxStatus';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction

const TxInternalTableItem = ({ type, from, to, value, success, error, gas_limit: gasLimit }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;

  return (
    <Tr alignItems="top">
      <Td>
        <Flex rowGap={ 2 } flexWrap="wrap">
          { typeTitle && (
            <Box w="126px" display="inline-block">
              <Tag colorScheme="cyan" mr={ 5 }>{ typeTitle }</Tag>
            </Box>
          ) }
          <TxStatus status={ success ? 'ok' : 'error' } errorText={ error }/>
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Address display="inline-flex" maxW="100%">
          <AddressIcon hash={ from.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 }/>
        </Address>
      </Td>
      <Td px={ 0 } verticalAlign="middle">
        <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500"/>
      </Td>
      <Td verticalAlign="middle">
        <Address display="inline-flex" maxW="100%">
          <AddressIcon hash={ to.hash }/>
          <AddressLink hash={ to.hash } alias={ to.name } fontWeight="500" ml={ 2 }/>
        </Address>
      </Td>
      <Td isNumeric verticalAlign="middle">
        { value }
      </Td>
      <Td isNumeric verticalAlign="middle">
        { BigNumber(gasLimit).toFormat() }
      </Td>
    </Tr>
  );
};

export default React.memo(TxInternalTableItem);
