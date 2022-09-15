import { Box, Tr, Td, Tag, Link, Icon, VStack, Text, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

import rightArrowIcon from 'icons/arrows/right.svg';
import infoIcon from 'icons/info.svg';
import dayjs from 'lib/date/dayjs';
import useLink from 'lib/link/useLink';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';
import TxStatus from 'ui/shared/TxStatus';

import TxType from './TxType';

const TxsTableItem = (item) => {
  const link = useLink();

  const isLargeScreen = useBreakpointValue({ base: false, xl: true });

  const addressFrom = (
    <Address>
      <AddressIcon hash={ item.address_from.hash }/>
      <AddressLink hash={ item.address_from.hash } alias={ item.address_from.alias } fontWeight="500" ml={ 2 }/>
    </Address>
  );

  const addressTo = (
    <Address>
      <AddressIcon hash={ item.address_to.hash }/>
      <AddressLink hash={ item.address_to.hash } alias={ item.address_to.alias } fontWeight="500" ml={ 2 }/>
    </Address>
  );

  return (
    <Tr>
      <Td pl={ 4 }>
        <Icon as={ infoIcon } boxSize={ 5 } color="blue.600"/>
      </Td>
      <Td>
        <VStack alignItems="start">
          <TxType type={ item.txType }/>
          <TxStatus status={ item.status }/>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start" lineHeight="24px">
          <Address width="100%">
            <AddressLink
              hash={ item.hash }
              type="transaction"
              fontWeight="700"
            />
          </Address>
          <Text color="gray.500" fontWeight="400">{ dayjs(item.timestamp).fromNow() }</Text>
        </VStack>
      </Td>
      <Td>
        <TruncatedTextTooltip label={ item.method }>
          <Tag
            colorScheme={ item.method === 'Multicall' ? 'teal' : 'gray' }
          >
            { item.method }
          </Tag>
        </TruncatedTextTooltip>
      </Td>
      <Td>
        <Link href={ link('block', { id: item.block_num }) }>{ item.block_num }</Link>
      </Td>
      { isLargeScreen ? (
        <>
          <Td>
            { addressFrom }
          </Td>
          <Td>
            <Icon as={ rightArrowIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
          </Td>
          <Td>
            { addressTo }
          </Td>
        </>
      ) : (
        <Td colSpan={ 3 }>
          <Box>
            { addressFrom }
            <Icon
              as={ rightArrowIcon }
              boxSize={ 6 }
              mt={ 2 }
              mb={ 1 }
              color="gray.500"
              transform="rotate(90deg)"
            />
            { addressTo }
          </Box>
        </Td>
      ) }
      <Td isNumeric>
        { item.amount.value.toFixed(8) }
      </Td>
      <Td isNumeric>
        { item.fee.value.toFixed(8) }
      </Td>
    </Tr>
  );
};

export default TxsTableItem;
