import {
  Box,
  Flex,
  HStack,
  Text,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import { currencyUnits } from 'lib/units';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
}

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const timeAgo = useTimeAgoIncrement(tx.timestamp || '0', true);

  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor="divider"
      py={ 4 }
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      display={{ base: 'block', lg: 'none' }}
    >
      <Flex justifyContent="space-between">
        <HStack flexWrap="wrap">
          <TxType types={ tx.tx_types } isLoading={ isLoading }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </HStack>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </Flex>
      <Flex
        mt={ 2 }
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        mb={ 6 }
      >
        <TxEntity
          isLoading={ isLoading }
          hash={ tx.hash }
          fontWeight="700"
          truncation="constant_long"
        />
        { tx.timestamp && (
          <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm" ml={ 3 }>
            <span>{ timeAgo }</span>
          </Skeleton>
        ) }
      </Flex>
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        isLoading={ isLoading }
        fontSize="sm"
        fontWeight="500"
        mb={ 3 }
      />
      { !config.UI.views.tx.hiddenFields?.value && (
        <Skeleton isLoaded={ !isLoading } mb={ 2 } fontSize="sm" w="fit-content">
          <Text as="span">Value { currencyUnits.ether } </Text>
          <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() }</Text>
        </Skeleton>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Skeleton isLoaded={ !isLoading } fontSize="sm" w="fit-content" display="flex" whiteSpace="pre">
          <Text as="span">Fee { !config.UI.views.tx.hiddenFields?.fee_currency ? `${ currencyUnits.ether } ` : '' }</Text>
          { tx.stability_fee ? (
            <TxFeeStability data={ tx.stability_fee } accuracy={ 5 } color="text_secondary" hideUsd/>
          ) : (
            <Text as="span" variant="secondary">{ tx.fee.value ? getValueWithUnit(tx.fee.value).dp(5).toFormat() : '-' }</Text>
          ) }
        </Skeleton>
      ) }
    </Box>
  );
};

export default React.memo(LatestTxsItem);
