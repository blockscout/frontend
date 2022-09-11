import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Box,
  Tr,
  Td,
  Flex,
  Stat,
  StatArrow,
  Portal,
  Link,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

import type { TTxStateItem } from 'data/txState';
import { nbsp } from 'lib/html-entities';
import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';

import TxStateStorageItem from './TxStateStorageItem';

const TxStateTableItem = ({ txStateItem }: { txStateItem: TTxStateItem }) => {
  const ref = useRef<HTMLTableDataCellElement>(null);

  const hasStorageData = Boolean(txStateItem.storage?.length);

  // FIXME: I'm not sure about dark theme colors
  const storageCounterBgColor = useColorModeValue('blue.50', 'gray.800');
  const storageCounterColor = useColorModeValue('blue.700', 'gray.50');
  const storageBorderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <>
      <AccordionItem as="tr" isDisabled={ !hasStorageData } fontWeight={ 500 } border={ 0 }>
        { ({ isExpanded }) => (
          <>
            <Td border={ 0 }>
              <Flex>
                <Center
                  background={ isExpanded ? storageCounterBgColor : 'unset' }
                  color={ storageCounterColor }
                  width="30px"
                  height="30px"
                  borderRadius="6px"
                  border={ isExpanded ? 'none' : '1px solid' }
                  borderColor={ storageBorderColor }
                  opacity={ hasStorageData ? 1 : 0.2 }
                >
                  { txStateItem.storage?.length || '0' }
                </Center>
                <AccordionButton
                  _hover={{ background: 'unset', cursor: 'pointer' }}
                  padding="0"
                  width="30px"
                  justifyContent="center"
                >
                  <AccordionIcon color="blue.600"/>
                </AccordionButton>
              </Flex>
            </Td>
            <Td border={ 0 }>
              <Flex height="30px" alignItems="center">
                <AddressIcon address={ txStateItem.address }/>
                <AddressLinkWithTooltip address={ txStateItem.address } fontWeight="500" truncated withCopy={ false } ml={ 2 }/>
              </Flex>
            </Td>
            <Td border={ 0 } lineHeight="30px"><Link>{ txStateItem.miner }</Link></Td>
            <Td border={ 0 } isNumeric lineHeight="30px">
              <Box>{ txStateItem.after.balance }</Box>
              { typeof txStateItem.after.nonce !== 'undefined' && (
                <Flex justifyContent="end">Nonce: <Text fontWeight={ 600 }>{ nbsp + txStateItem.after.nonce }</Text></Flex>
              ) }
            </Td>
            <Td border={ 0 } isNumeric lineHeight="30px">{ txStateItem.before.balance }</Td>
            <Td border={ 0 } isNumeric lineHeight="30px">
              <Stat>
                { txStateItem.diff }
                <StatArrow ml={ 2 } type={ Number(txStateItem.diff) > 0 ? 'increase' : 'decrease' }/>
              </Stat>
            </Td>
            { hasStorageData && (
              <Portal containerRef={ ref }>
                <AccordionPanel fontWeight={ 500 }>
                  { txStateItem.storage?.map((storageItem, index) => <TxStateStorageItem key={ index } storageItem={ storageItem }/>) }
                </AccordionPanel>
              </Portal>
            ) }
          </>
        ) }
      </AccordionItem>
      <Tr><Td colSpan={ 6 } ref={ ref } padding={ 0 }></Td></Tr>
    </>
  );
};

export default TxStateTableItem;
