// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  HStack,
  Flex,
} from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { NovesDescribeTxsResponse } from 'src/features/tx-interpretation/noves/types/api';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
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
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  tx: schemas['Transaction'];
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  animation?: string;
  chainData?: ClusterChainConfig;
  translationIsLoading?: boolean;
  translationData?: NovesDescribeTxsResponse;
};

const TxsListItem = ({
  tx,
  isLoading,
  showBlockInfo,
  currentAddress,
  enableTimeIncrement,
  animation,
  chainData,
  translationIsLoading,
  translationData,
}: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const protocolTag = tx.to?.hash !== currentAddress && tx.to?.metadata?.tags?.find(tag => tag.tagType === 'protocol');

  return (
    <ListItemMobile display="block" width="100%" animation={ animation } key={ tx.hash }>
      <Flex justifyContent="space-between" alignItems="flex-start" mt={ 4 }>
        <HStack flexWrap="wrap">
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
          { protocolTag && <MetadataTag data={ protocolTag } isLoading={ isLoading } noColors/> }
        </HStack>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </Flex>
      <Flex justifyContent="space-between" lineHeight="24px" mt={ 3 } alignItems="center">
        <TxEntity
          isLoading={ isLoading }
          hash={ tx.hash }
          truncation="constant_long"
          fontWeight="700"
          icon={ !tx.is_pending_update && tx.transaction_types.includes('blob_transaction') ? { name: 'blob' } : undefined }
          chain={ chainData }
          isPendingUpdate={ tx.is_pending_update ?? undefined }
        />
        <TimeWithTooltip
          timestamp={ tx.timestamp }
          enableIncrement={ enableTimeIncrement }
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          fontSize="sm"
        />
      </Flex>
      { tx.method && (
        <Flex mt={ 3 }>
          <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Method </Skeleton>
          <Skeleton
            loading={ isLoading }
            color="text.secondary"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            <span>{ tx.method }</span>
          </Skeleton>
        </Flex>
      ) }
      { showBlockInfo && tx.block_number !== null && (
        <Flex mt={ 2 }>
          <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Block </Skeleton>
          <BlockEntity
            isLoading={ isLoading }
            number={ tx.block_number }
            noIcon
          />
        </Flex>
      ) }
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        current={ currentAddress }
        isLoading={ isLoading }
        mt={ 6 }
        fontWeight="500"
      />
      { !config.slices.tx.hiddenFields?.value && (
        <Flex mt={ 2 } columnGap={ 2 }>
          <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Value</Skeleton>
          <NativeCoinValue
            amount={ tx.value }
            exchangeRate={ tx.exchange_rate }
            historicalExchangeRate={ tx.historic_exchange_rate }
            loading={ isLoading }
            color="text.secondary"
          />
        </Flex>
      ) }
      { !config.slices.tx.hiddenFields?.tx_fee && (
        <Flex mt={ 2 } mb={ 3 } columnGap={ 2 }>
          { (tx.stability_fee !== undefined || tx.fee.value !== null) && (
            <>
              <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Fee</Skeleton>
              <TxFee tx={ tx } loading={ isLoading } color="text.secondary"/>
            </>
          ) }
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TxsListItem);
