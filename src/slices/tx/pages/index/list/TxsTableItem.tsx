// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, VStack } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { NovesDescribeTxsResponse } from 'src/features/tx-interpretation/noves/types/api';
import type { Transaction } from 'src/slices/tx/types/api';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import BlockPendingUpdateHint from 'src/slices/block/components/BlockPendingUpdateHint';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import TxAdditionalInfo from 'src/slices/tx/components/TxAdditionalInfo';
import TxFee from 'src/slices/tx/components/TxFee';
import TxStatus from 'src/slices/tx/components/TxStatus';
import TxType from 'src/slices/tx/components/TxType';

import TxWatchListTags from 'src/features/account/components/TxWatchListTags';
import MetadataTag from 'src/features/address-metadata/components/tag/MetadataTag';
import TxTranslationType from 'src/features/tx-interpretation/noves/components/TxTranslationType';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  animation?: string;
  chainData?: ClusterChainConfig;
  translationIsLoading?: boolean;
  translationData?: NovesDescribeTxsResponse;
  isMobile?: boolean;
};

const TxsTableItem = ({
  tx,
  showBlockInfo,
  currentAddress,
  enableTimeIncrement,
  isLoading,
  animation,
  chainData,
  translationIsLoading,
  translationData,
  isMobile,
}: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const protocolTag = tx.to?.hash !== currentAddress && tx.to?.metadata?.tags?.find(tag => tag.tagType === 'protocol');

  return (
    <TableRow key={ tx.hash } animation={ animation }>
      <TableCell textAlign="center">
        <TxAdditionalInfo tx={ tx } isMobile={ isMobile } isLoading={ isLoading }/>
      </TableCell>
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading } my="2px"/>
        </TableCell>
      ) }
      <TableCell pr={ 4 }>
        <VStack alignItems="start" lineHeight="24px">
          <TxEntity
            hash={ tx.hash }
            isLoading={ isLoading }
            fontWeight="bold"
            noIcon
            maxW="100%"
            truncation="constant"
          />
          <TimeWithTooltip
            timestamp={ tx.timestamp }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
            color="text.secondary"
          />
        </VStack>
      </TableCell>
      <TableCell>
        <VStack alignItems="stretch">
          { translationIsLoading || translationData ? (
            <TxTranslationType
              txTypes={ tx.transaction_types }
              isLoading={ isLoading || translationIsLoading }
              type={ translationData?.type }
            />
          ) :
            <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          }
          { tx.status !== 'ok' && <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/> }
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </VStack>
      </TableCell>
      <TableCell whiteSpace="nowrap">
        <VStack alignItems="flex-start">
          { tx.method && (
            <Badge colorPalette={ tx.method === 'Multicall' ? 'teal' : 'gray' } loading={ isLoading } truncated>
              <span>{ tx.method }</span>
            </Badge>
          ) }
          { protocolTag && <MetadataTag data={ protocolTag } isLoading={ isLoading } maxW="100%" noColors/> }
        </VStack>
      </TableCell>
      { showBlockInfo && (
        <TableCell>
          <Flex alignItems="center" gap={ 2 }>
            { tx.block_number && (
              <BlockEntity
                isLoading={ isLoading }
                number={ tx.block_number }
                noIcon
                textStyle="sm"
                fontWeight={ 500 }
              />
            ) }
            { tx.is_pending_update && <BlockPendingUpdateHint view="tx"/> }
          </Flex>
        </TableCell>
      ) }
      <TableCell>
        <AddressFromTo
          from={ tx.from }
          to={ dataTo }
          current={ currentAddress }
          isLoading={ isLoading }
          mt="2px"
          mode="compact"
        />
      </TableCell>
      { !config.slices.tx.hiddenFields?.value && (
        <TableCell isNumeric>
          <NativeCoinValue
            amount={ tx.value }
            noSymbol
            loading={ isLoading }
            exchangeRate={ tx.exchange_rate }
            historicalExchangeRate={ tx.historic_exchange_rate }
            layout="vertical"
            rowGap={ 3 }
          />
        </TableCell>
      ) }
      { !config.slices.tx.hiddenFields?.tx_fee && (
        <TableCell isNumeric maxW="220px">
          <TxFee
            tx={ tx }
            accuracy={ 8 }
            loading={ isLoading }
            noSymbol={ !(tx.celo || tx.stability_fee) }
            layout="vertical"
            rowGap={ 3 }
          />
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(TxsTableItem);
