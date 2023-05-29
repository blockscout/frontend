import {
  Tr,
  Td,
  VStack,
  Show,
  Hide,
  Flex,
  Skeleton,
  Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import rightArrowIcon from 'icons/arrows/east.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CurrencyValue from 'ui/shared/CurrencyValue';
import InOutTag from 'ui/shared/InOutTag';
import LinkInternal from 'ui/shared/LinkInternal';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import TxType from './TxType';

type Props = {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
}

const TxsTableItem = ({ tx, showBlockInfo, currentAddress, enableTimeIncrement, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const isOut = Boolean(currentAddress && currentAddress === tx.from.hash);
  const isIn = Boolean(currentAddress && currentAddress === dataTo?.hash);

  const timeAgo = useTimeAgoIncrement(tx.timestamp, enableTimeIncrement);

  const addressFrom = (
    <Address w="100%">
      <AddressIcon address={ tx.from } isLoading={ isLoading }/>
      <AddressLink
        type="address"
        hash={ tx.from.hash }
        alias={ tx.from.name }
        fontWeight="500" ml={ 2 }
        truncation="constant"
        isDisabled={ isOut }
        isLoading={ isLoading }
      />
      { !isOut && <CopyToClipboard text={ tx.from.hash } isLoading={ isLoading }/> }
    </Address>
  );

  const addressTo = dataTo ? (
    <Address w="100%">
      <AddressIcon address={ dataTo } isLoading={ isLoading }/>
      <AddressLink
        type="address"
        hash={ dataTo.hash }
        alias={ dataTo.name }
        fontWeight="500"
        ml={ 2 }
        truncation="constant"
        isDisabled={ isIn }
        isLoading={ isLoading }
      />
      { !isIn && <CopyToClipboard text={ dataTo.hash } isLoading={ isLoading }/> }
    </Address>
  ) : '-';

  return (
    <Tr
      as={ motion.tr }
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      key={ tx.hash }
    >
      <Td pl={ 4 }>
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading }/>
      </Td>
      <Td pr={ 4 }>
        <VStack alignItems="start" lineHeight="24px">
          <Address width="100%">
            <AddressLink
              hash={ tx.hash }
              type="transaction"
              fontWeight="700"
              isLoading={ isLoading }
            />
          </Address>
          { tx.timestamp && <Skeleton color="text_secondary" fontWeight="400" isLoaded={ !isLoading }><span>{ timeAgo }</span></Skeleton> }
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start">
          <TxType types={ tx.tx_types } isLoading={ isLoading }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
        </VStack>
      </Td>
      <Td whiteSpace="nowrap">
        { tx.method && (
          <Tag colorScheme={ tx.method === 'Multicall' ? 'teal' : 'gray' } isLoading={ isLoading } isTruncated>
            { tx.method }
          </Tag>
        ) }
      </Td>
      { showBlockInfo && (
        <Td>
          { tx.block && (
            <Skeleton isLoaded={ !isLoading } display="inline-block">
              <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: tx.block.toString() } }) }>
                { tx.block }
              </LinkInternal>
            </Skeleton>
          ) }
        </Td>
      ) }
      <Show above="xl" ssr={ false }>
        <Td>
          { addressFrom }
        </Td>
        <Td px={ 0 }>
          { (isIn || isOut) ?
            <InOutTag isIn={ isIn } isOut={ isOut } width="48px" mr={ 2 } isLoading={ isLoading }/> : (
              <Box mx="6px">
                <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
              </Box>
            ) }
        </Td>
        <Td>
          { addressTo }
        </Td>
      </Show>
      <Hide above="xl" ssr={ false }>
        <Td colSpan={ 3 }>
          <Flex alignItems="center">
            { (isIn || isOut) ?
              <InOutTag isIn={ isIn } isOut={ isOut } width="48px" isLoading={ isLoading }/> : (
                <Icon
                  as={ rightArrowIcon }
                  boxSize={ 6 }
                  color="gray.500"
                  transform="rotate(90deg)"
                  isLoading={ isLoading }
                />
              ) }
            <VStack alignItems="start" overflow="hidden" ml={ 1 }>
              { addressFrom }
              { addressTo }
            </VStack>
          </Flex>
        </Td>
      </Hide>
      <Td isNumeric>
        <CurrencyValue value={ tx.value } accuracy={ 8 } isLoading={ isLoading }/>
      </Td>
      <Td isNumeric>
        <CurrencyValue value={ tx.fee.value } accuracy={ 8 } isLoading={ isLoading }/>
      </Td>
    </Tr>
  );
};

export default React.memo(TxsTableItem);
