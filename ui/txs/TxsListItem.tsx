import {
  HStack,
  Box,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import rightArrowIcon from 'icons/arrows/east.svg';
import getValueWithUnit from 'lib/getValueWithUnit';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import { space } from 'lib/html-entities';
import Icon from 'ui/shared/chakra/Icon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import InOutTag from 'ui/shared/InOutTag';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
}

const TAG_WIDTH = 48;
const ARROW_WIDTH = 24;

const TxsListItem = ({ tx, isLoading, showBlockInfo, currentAddress, enableTimeIncrement }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const isOut = Boolean(currentAddress && currentAddress === tx.from.hash);
  const isIn = Boolean(currentAddress && currentAddress === tx.to?.hash);

  const timeAgo = useTimeAgoIncrement(tx.timestamp, enableTimeIncrement);

  return (
    <ListItemMobile display="block" width="100%" isAnimated key={ tx.hash }>
      <Flex justifyContent="space-between" mt={ 4 }>
        <HStack flexWrap="wrap">
          <TxType types={ tx.tx_types } isLoading={ isLoading }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </HStack>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </Flex>
      <Flex justifyContent="space-between" lineHeight="24px" mt={ 3 } alignItems="center">
        <TxEntity
          isLoading={ isLoading }
          hash={ tx.hash }
          truncation="constant"
          fontWeight="700"
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
      <Flex alignItems="center" height={ 6 } mt={ 6 }>
        <AddressEntity
          address={ tx.from }
          isLoading={ isLoading }
          noLink={ isOut }
          noCopy={ isOut }
          w={ `calc((100% - ${ currentAddress ? TAG_WIDTH + 16 : ARROW_WIDTH + 8 }px)/2)` }
          fontWeight="500"
        />
        { (isIn || isOut) ?
          <InOutTag isIn={ isIn } isOut={ isOut } width="48px" mx={ 2 } isLoading={ isLoading }/> : (
            <Box mx={ 2 }>
              <Icon
                as={ rightArrowIcon }
                boxSize={ 6 }
                color="gray.500"
                isLoading={ isLoading }
              />
            </Box>
          ) }
        { dataTo ? (
          <AddressEntity
            address={ dataTo }
            isLoading={ isLoading }
            noLink={ isIn }
            noCopy={ isIn }
            w={ `calc((100% - ${ currentAddress ? TAG_WIDTH + 16 : ARROW_WIDTH + 8 }px)/2)` }
            fontWeight="500"
          />
        ) : '-' }
      </Flex>
      { !config.UI.views.tx.hiddenFields?.value && (
        <Flex mt={ 2 } columnGap={ 2 }>
          <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Value</Skeleton>
          <Skeleton isLoaded={ !isLoading } display="inline-block" variant="text_secondary" whiteSpace="pre">
            { getValueWithUnit(tx.value).toFormat() }
            { space }
            { config.chain.currency.symbol }
          </Skeleton>
        </Flex>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Flex mt={ 2 } mb={ 3 } columnGap={ 2 }>
          <Skeleton isLoaded={ !isLoading } display="inline-block" whiteSpace="pre">Fee</Skeleton>
          { tx.stability_fee ? (
            <TxFeeStability data={ tx.stability_fee } isLoading={ isLoading } hideUsd/>
          ) : (
            <Skeleton isLoaded={ !isLoading } display="inline-block" variant="text_secondary" whiteSpace="pre">
              { getValueWithUnit(tx.fee.value).toFormat() }
              { config.UI.views.tx.hiddenFields?.fee_currency ? '' : ` ${ config.chain.currency.symbol }` }
            </Skeleton>
          ) }
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TxsListItem);
