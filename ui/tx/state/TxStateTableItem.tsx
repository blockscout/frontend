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
  Button,
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

  return (
    <>
      <AccordionItem as="tr" isDisabled={ !hasStorageData } fontWeight={ 500 } border={ 0 }>
        { ({ isExpanded }) => (
          <>
            <Td border={ 0 }>
              <AccordionButton
                _hover={{ background: 'unset' }}
                padding="0"
              >
                <Button
                  variant="outline"
                  borderWidth="1px"
                  // button can't be inside button (AccordionButton)
                  as="div"
                  isActive={ isExpanded }
                  size="sm"
                  fontWeight={ 400 }
                  isDisabled={ !hasStorageData }
                  colorScheme="gray"
                  // AccordionButton has its own opacity rule when disabled
                  _disabled={{ opacity: 1 }}
                >
                  { txStateItem.storage?.length || '0' }
                </Button>
                <AccordionIcon color="blue.600" width="30px"/>
              </AccordionButton>
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
                <Box justifyContent="end" display="inline-flex">Nonce: <Text fontWeight={ 600 }>{ nbsp + txStateItem.after.nonce }</Text></Box>
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
