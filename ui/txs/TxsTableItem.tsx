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
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import link from 'lib/link/link';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CurrencyValue from 'ui/shared/CurrencyValue';
import InOutTag from 'ui/shared/InOutTag';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import TxType from './TxType';

type Props = {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
}

const TxsTableItem = ({ tx, showBlockInfo, currentAddress, enableTimeIncrement }: Props) => {
  const isOut = Boolean(currentAddress && currentAddress === tx.from.hash);
  const isIn = Boolean(currentAddress && currentAddress === tx.to?.hash);

  const timeAgo = useTimeAgoIncrement(tx.timestamp, enableTimeIncrement);

  const addressFrom = (
    <Address>
      <Tooltip label={ tx.from.implementation_name }>
        <Box display="flex"><AddressIcon address={ tx.from }/></Box>
      </Tooltip>
      <AddressLink hash={ tx.from.hash } alias={ tx.from.name } fontWeight="500" ml={ 2 } truncation="constant"/>
    </Address>
  );

  const dataTo = tx.to ? tx.to : tx.created_contract;

  const addressTo = (
    <Address>
      <Tooltip label={ dataTo.implementation_name }>
        <Box display="flex"><AddressIcon address={ dataTo }/></Box>
      </Tooltip>
      <AddressLink hash={ dataTo.hash } alias={ dataTo.name } fontWeight="500" ml={ 2 } truncation="constant"/>
    </Address>
  );

  const infoBorderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
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
      <Td pr={ 4 }>
        <VStack alignItems="start" lineHeight="24px">
          <Address width="100%">
            <AddressLink
              hash={ tx.hash }
              type="transaction"
              fontWeight="700"
            />
          </Address>
          { tx.timestamp && <Text color="gray.500" fontWeight="400">{ timeAgo }</Text> }
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start">
          <TxType types={ tx.tx_types }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined }/>
        </VStack>
      </Td>
      <Td whiteSpace="nowrap">
        { tx.method ? (
          <TruncatedTextTooltip label={ tx.method }>
            <Tag colorScheme={ tx.method === 'Multicall' ? 'teal' : 'gray' }>
              { tx.method }
            </Tag>
          </TruncatedTextTooltip>
        ) : '-' }
      </Td>
      { showBlockInfo && (
        <Td>
          { tx.block && <Link href={ link('block', { id: tx.block.toString() }) }>{ tx.block }</Link> }
        </Td>
      ) }
      <Show above="xl" ssr={ false }>
        <Td>
          { addressFrom }
        </Td>
        <Td px={ 0 }>
          { (isIn || isOut) ?
            <InOutTag isIn={ isIn } isOut={ isOut } width="48px" mr={ 2 }/> :
            <Icon as={ rightArrowIcon } boxSize={ 6 } mx="6px" color="gray.500"/>
          }
        </Td>
        <Td>
          { addressTo }
        </Td>
      </Show>
      <Hide above="xl" ssr={ false }>
        <Td colSpan={ 3 }>
          <Box>
            { addressFrom }
            { (isIn || isOut) ?
              <InOutTag isIn={ isIn } isOut={ isOut } width="48px" my={ 2 }/> : (
                <Icon
                  as={ rightArrowIcon }
                  boxSize={ 6 }
                  mt={ 2 }
                  mb={ 1 }
                  color="gray.500"
                  transform="rotate(90deg)"
                />
              ) }
            { addressTo }
          </Box>
        </Td>
      </Hide>
      <Td isNumeric>
        <CurrencyValue value={ tx.value } accuracy={ 8 }/>
      </Td>
      <Td isNumeric>
        <CurrencyValue value={ tx.fee.value } accuracy={ 8 }/>
      </Td>
    </Tr>
  );
};

export default TxsTableItem;
