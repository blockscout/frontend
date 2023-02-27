import {
  AccordionItem,
  AccordionButton,
  // AccordionPanel,
  AccordionIcon,
  Box,
  Tr,
  Td,
  Stat,
  StatArrow,
  // Portal,
  Button,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
// import { nbsp } from 'lib/html-entities';
// import TxStateStorageItem from './TxStateStorageItem';

import { formatData } from './utils';

interface Props {
  data: TxStateChange;
}

const TxStateTableItem = ({ data }: Props) => {
  const ref = useRef<HTMLTableDataCellElement>(null);

  const hasStorageData = false;

  const { balanceBefore, balanceAfter, difference, isIncrease } = formatData(data);

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
                  { data.storage?.length || '0' }
                </Button>
                <AccordionIcon color="blue.600" width="30px"/>
              </AccordionButton>
            </Td>
            <Td border={ 0 }>
              <Address height="30px">
                <AddressIcon address={ data.address }/>
                <AddressLink type="address" hash={ data.address.hash } fontWeight="500" truncation="constant" ml={ 2 }/>
              </Address>
            </Td>
            <Td border={ 0 } lineHeight="30px">
              { data.is_miner ? 'Validator' : '-' }
            </Td>
            <Td border={ 0 } isNumeric lineHeight="30px">
              <Box>{ balanceBefore }</Box>
              { /* { typeof txStateItem.after.nonce !== 'undefined' && (
                <Box justifyContent="end" display="inline-flex">Nonce: <Text fontWeight={ 600 }>{ nbsp + txStateItem.after.nonce }</Text></Box>
              ) } */ }
            </Td>
            <Td border={ 0 } isNumeric lineHeight="30px">{ balanceAfter }</Td>
            <Td border={ 0 } isNumeric lineHeight="30px">
              <Stat>
                { difference }
                <StatArrow ml={ 2 } type={ isIncrease ? 'increase' : 'decrease' }/>
              </Stat>
            </Td>
            { /* { hasStorageData && (
              <Portal containerRef={ ref }>
                <AccordionPanel fontWeight={ 500 }>
                  { data.storage?.map((storageItem, index) => <TxStateStorageItem key={ index } storageItem={ storageItem }/>) }
                </AccordionPanel>
              </Portal>
            ) } */ }
          </>
        ) }
      </AccordionItem>
      <Tr><Td colSpan={ 6 } ref={ ref } padding={ 0 }></Td></Tr>
    </>
  );
};

export default TxStateTableItem;
