import {
  HStack,
  Flex,

} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { space } from 'toolkit/utils/htmlEntities';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TxFee from 'ui/shared/tx/TxFee';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

import TxTranslationType from './TxTranslationType';

type Props = {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  animation?: string;
};

const TxsListItem = ({ tx, isLoading, showBlockInfo, currentAddress, enableTimeIncrement, animation }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  return (
    <ListItemMobile display="block" width="100%" animation={ animation } key={ tx.hash }>
      <Flex justifyContent="space-between" alignItems="flex-start" mt={ 4 }>
        <HStack flexWrap="wrap">
          { tx.translation ? (
            <TxTranslationType
              types={ tx.transaction_types }
              isLoading={ isLoading || tx.translation.isLoading }
              translatationType={ tx.translation.data?.type }
            />
          ) :
            <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          }
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </HStack>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </Flex>
      <Flex justifyContent="space-between" lineHeight="24px" mt={ 3 } alignItems="center">
        <TxEntity
          isLoading={ isLoading }
          hash={ tx.hash }
          truncation="constant_long"
          fontWeight="700"
          icon={{
            name: tx.transaction_types.includes('blob_transaction') ? 'blob' : undefined,
          }}
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
          <Skeleton loading={ isLoading } display="inline-block" color="text.secondary" whiteSpace="pre">
            <span>
              { getValueWithUnit(tx.value).toFormat() }
              { space }
              { currencyUnits.ether }
            </span>
          </Skeleton>
        </Flex>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Flex mt={ 2 } mb={ 3 } columnGap={ 2 }>
          { (tx.stability_fee !== undefined || tx.fee.value !== null) && (
            <>
              <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre">Fee</Skeleton>
              <TxFee tx={ tx } isLoading={ isLoading }/>
            </>
          ) }
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TxsListItem);
