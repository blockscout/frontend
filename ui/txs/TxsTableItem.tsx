import {
  Box,
  Tr,
  Td,
  Tag,
  Link,
  Icon,
  VStack,
  Text,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue,
  Show,
  Hide,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import rightArrowIcon from 'icons/arrows/east.svg';
import dayjs from 'lib/date/dayjs';
import link from 'lib/link/link';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import TxType from './TxType';

const TxsTableItem = ({ tx }: {tx: Transaction}) => {
  const addressFrom = (
    <Address>
      <Tooltip label={ tx.from.implementation_name }>
        <Box display="flex"><AddressIcon hash={ tx.from.hash }/></Box>
      </Tooltip>
      <AddressLink hash={ tx.from.hash } alias={ tx.from.name } fontWeight="500" ml={ 2 } truncation="constant"/>
    </Address>
  );

  const addressTo = (
    <Address>
      <Tooltip label={ tx.to.implementation_name }>
        <Box display="flex"><AddressIcon hash={ tx.to.hash }/></Box>
      </Tooltip>
      <AddressLink hash={ tx.to.hash } alias={ tx.to.name } fontWeight="500" ml={ 2 } truncation="constant"/>
    </Address>
  );

  const infoBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  return (
    <Tr>
      <Td pl={ 4 }>
        <Popover placement="right-start" openDelay={ 300 } isLazy>
          { ({ isOpen }) => (
            <>
              <PopoverTrigger>
                <AdditionalInfoButton isOpen={ isOpen }/>
              </PopoverTrigger>
              <PopoverContent border="1px solid" borderColor={ infoBorderColor }>
                <PopoverBody>
                  <TxAdditionalInfo tx={ tx }/>
                </PopoverBody>
              </PopoverContent>
            </>
          ) }
        </Popover>
      </Td>
      <Td>
        <VStack alignItems="start">
          { tx.tx_types.map(item => <TxType key={ item } type={ item }/>) }
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined }/>
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start" lineHeight="24px">
          <Address width="100%">
            <AddressLink
              hash={ tx.hash }
              type="transaction"
              fontWeight="700"
              target="_self"
            />
          </Address>
          <Text color="gray.500" fontWeight="400">{ dayjs(tx.timestamp).fromNow() }</Text>
        </VStack>
      </Td>
      <Td>
        <TruncatedTextTooltip label={ tx.method }>
          <Tag
            colorScheme={ tx.method === 'Multicall' ? 'teal' : 'gray' }
          >
            { tx.method }
          </Tag>
        </TruncatedTextTooltip>
      </Td>
      <Td>
        { tx.block && <Link href={ link('block', { id: tx.block.toString() }) }>{ tx.block }</Link> }
      </Td>
      <Show above="xl" ssr={ false }>
        <Td>
          { addressFrom }
        </Td>
        <Td>
          <Icon as={ rightArrowIcon } boxSize={ 6 } mr={ 2 } color="gray.500"/>
        </Td>
        <Td>
          { addressTo }
        </Td>
      </Show>
      <Hide above="xl" ssr={ false }>
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
      </Hide>
      <Td isNumeric>
        <CurrencyValue value={ tx.value }/>
      </Td>
      <Td isNumeric>
        <CurrencyValue value={ tx.fee.value } accuracy={ 8 }/>
      </Td>
    </Tr>
  );
};

export default TxsTableItem;
