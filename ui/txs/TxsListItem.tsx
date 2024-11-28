import {
  HStack,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import { useBlobScan } from 'lib/hooks/useBlobScan';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import { useWvmArchiver } from 'lib/hooks/useWvmArchiver';
import { space } from 'lib/html-entities';
import { currencyUnits } from 'lib/units';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import BlobScanTag from 'ui/shared/statusTag/BlobScanTag';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import WvmArchiverTag from 'ui/shared/statusTag/WvmArchiverTag';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
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
}

const TxsListItem = ({ tx, isLoading, showBlockInfo, currentAddress, enableTimeIncrement }: Props) => {
  const isBlobScan = useBlobScan({ address: tx.from.hash });
  const isWvmArchiver = useWvmArchiver({ address: tx.from.hash });
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const timeAgo = useTimeAgoIncrement(tx.timestamp, enableTimeIncrement);

  return (
    <ListItemMobile display="block" width="100%" isAnimated key={ tx.hash }>
      <Flex justifyContent="space-between" mt={ 4 }>
        <HStack flexWrap="wrap">
          { tx.translation ?
            <TxTranslationType types={ tx.tx_types } isLoading={ isLoading || tx.translation.isLoading } translatationType={ tx.translation.data?.type }/> :
            <TxType types={ tx.tx_types } isLoading={ isLoading }/>
          }
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
          { isWvmArchiver && <WvmArchiverTag/> }
          { isBlobScan && <BlobScanTag/> }
        </HStack>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </Flex>
      <Flex justifyContent="space-between" lineHeight="24px" mt={ 3 } alignItems="center">
        <TxEntity
          isLoading={ isLoading }
          hash={ tx.hash }
          truncation="constant_long"
          fontWeight="700"
          iconName={ tx.tx_types.includes('blob_transaction') ? 'blob' : undefined }
        />
        { tx.timestamp && (
          <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm">
            <span>{ timeAgo }</span>
          </Skeleton>
        ) }
      </Flex>
      { tx.method && (
        <Flex mt={ 3 }>
          <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Method </Skeleton>
          <Skeleton
            isLoaded={ !isLoading }
            color="text_secondary"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            <span>{ tx.method }</span>
          </Skeleton>
        </Flex>
      ) }
      { showBlockInfo && tx.block !== null && (
        <Flex mt={ 2 }>
          <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Block </Skeleton>
          <BlockEntity
            isLoading={ isLoading }
            number={ tx.block }
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
          <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Value</Skeleton>
          <Skeleton isLoaded={ !isLoading } display="inline-block" variant="text_secondary" whiteSpace="pre">
            { getValueWithUnit(tx.value).toFormat() }
            { space }
            { currencyUnits.ether }
          </Skeleton>
        </Flex>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Flex mt={ 2 } mb={ 3 } columnGap={ 2 }>
          { (tx.stability_fee !== undefined || tx.fee.value !== null) && (
            <>
              <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Fee</Skeleton>
              { tx.stability_fee ? (
                <TxFeeStability data={ tx.stability_fee } isLoading={ isLoading } hideUsd/>
              ) : (
                <Skeleton isLoaded={ !isLoading } display="inline-block" variant="text_secondary" whiteSpace="pre">
                  { getValueWithUnit(tx.fee.value || 0).toFormat() }
                  { config.UI.views.tx.hiddenFields?.fee_currency ? '' : ` ${ currencyUnits.ether }` }
                </Skeleton>
              ) }
            </>
          ) }
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TxsListItem);
