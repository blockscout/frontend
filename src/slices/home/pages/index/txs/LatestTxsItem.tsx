// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import TxAdditionalInfo from 'src/slices/tx/components/TxAdditionalInfo';
import TxFee from 'src/slices/tx/components/TxFee';
import TxStatus from 'src/slices/tx/components/TxStatus';
import TxType from 'src/slices/tx/components/TxType';

import TxWatchListTags from 'src/features/account/components/TxWatchListTags';
import MetadataTag from 'src/features/address-metadata/components/tag/MetadataTag';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

const hasValueColumn = !(config.slices.tx.hiddenFields?.value && config.slices.tx.hiddenFields?.tx_fee);

export const LATEST_TXS_TABLE_MIN_WIDTH = hasValueColumn ? '750px' : '700px';

interface Props {
  tx: schemas['Transaction'];
  isLoading?: boolean;
};

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const protocolTag = tx.to?.metadata?.tags?.find(tag => tag.tagType === 'protocol');

  const tagsCount = [
    1, // tx type
    1, // tx status
    ...(tx.from?.watchlist_names || []),
    ...(tx.to?.watchlist_names || []),
    protocolTag,
  ].filter(Boolean).length;

  return (
    <TableRow>
      <TableCell w="42px">
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading } my="2px"/>
      </TableCell>
      <TableCell>
        <VStack w="100%" overflow="hidden" alignItems="flex-start" gap="10px">
          <HStack flexWrap={ tagsCount <= 3 ? 'nowrap' : 'wrap' } w="100%">
            <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
            { tx.status !== 'ok' && <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/> }
            <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
            { protocolTag && <MetadataTag data={ protocolTag } isLoading={ isLoading } minW="0" noColors/> }
          </HStack>
          <HStack w="100%">
            <TxEntity
              isLoading={ isLoading }
              hash={ tx.hash }
              fontWeight="700"
            />
            <TimeWithTooltip
              timestamp={ tx.timestamp }
              enableIncrement
              timeFormat="relative"
              isLoading={ isLoading }
              color="text.secondary"
              flexShrink={ 0 }
              ml={ 2 }
            />
          </HStack>
        </VStack>
      </TableCell>
      <TableCell w={{ base: '224px', xl: hasValueColumn ? '324px' : '294px' }}>
        <AddressFromTo
          from={ tx.from }
          to={ dataTo }
          isLoading={ isLoading }
          mode="compact"
          mt="2px"
        />
      </TableCell>
      { hasValueColumn && (
        <TableCell w="182px">
          <Flex flexDir="column" rowGap={ 3 } mt="2px">
            { !config.slices.tx.hiddenFields?.value && (
              <Skeleton loading={ isLoading }>
                <Text as="span" whiteSpace="pre">Value </Text>
                <NativeCoinValue
                  amount={ tx.value }
                  accuracy={ 5 }
                  loading={ isLoading }
                  color="text.secondary"
                />
              </Skeleton>
            ) }
            { !config.slices.tx.hiddenFields?.tx_fee && (
              <Skeleton loading={ isLoading } display="flex" whiteSpace="pre">
                <Text as="span">Fee </Text>
                <TxFee tx={ tx } accuracy={ 5 } color="text.secondary" noUsd/>
              </Skeleton>
            ) }
          </Flex>
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(LatestTxsItem);
