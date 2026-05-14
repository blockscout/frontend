// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  HStack,
  Flex,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'client/slices/tx/types/api';
import type { NovesDescribeTxsResponse } from 'types/api/noves';
import type { ClusterChainConfig } from 'types/multichain';

import AddressFromTo from 'client/slices/address/components/from-to/AddressFromTo';
import BlockEntity from 'client/slices/block/components/entity/BlockEntity';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';
import TxAdditionalInfo from 'client/slices/tx/components/TxAdditionalInfo';
import TxFee from 'client/slices/tx/components/TxFee';
import TxStatus from 'client/slices/tx/components/TxStatus';
import TxType from 'client/slices/tx/components/TxType';

import TxWatchListTags from 'client/features/account/components/TxWatchListTags';
import TxTranslationType from 'client/features/tx-interpretation/noves/components/TxTranslationType';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

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
          { protocolTag && <EntityTag data={ protocolTag } isLoading={ isLoading } noColors/> }
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
          isPendingUpdate={ tx.is_pending_update }
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
      { !config.UI.views.tx.hiddenFields?.value && (
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
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
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
