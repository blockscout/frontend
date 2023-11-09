import {
  Box,
  Flex,
  HStack,
  Text,
  Grid,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import rightArrowIcon from 'icons/arrows/east.svg';
import getValueWithUnit from 'lib/getValueWithUnit';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Icon from 'ui/shared/chakra/Icon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
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
  const columnNum = config.UI.views.tx.hiddenFields?.value && config.UI.views.tx.hiddenFields?.tx_fee ? 2 : 3;

  return (
    <Grid
      gridTemplateColumns={ columnNum === 2 ? '3fr 2fr' : '3fr 2fr 150px' }
      gridGap={ 8 }
      width="100%"
      minW="700px"
      borderTop="1px solid"
      borderColor="divider"
      p={ 4 }
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      display={{ base: 'none', lg: 'grid' }}
    >
      <Flex overflow="hidden" w="100%">
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading }/>
        <Box ml={ 3 } w="calc(100% - 40px)">
          <HStack flexWrap="wrap">
            <TxType types={ tx.tx_types } isLoading={ isLoading }/>
            <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
            <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
          </HStack>
          <Flex
            mt={ 2 }
            alignItems="center"
          >
            <TxEntity
              isLoading={ isLoading }
              hash={ tx.hash }
              fontWeight="700"
            />
            { tx.timestamp && (
              <Skeleton
                isLoaded={ !isLoading }
                color="text_secondary"
                fontWeight="400"
                fontSize="sm"
                flexShrink={ 0 }
                ml={ 2 }
              >
                <span>{ timeAgo }</span>
              </Skeleton>
            ) }
          </Flex>
        </Box>
      </Flex>
      <Grid alignItems="center" alignSelf="flex-start" templateColumns="24px auto">
        <Icon
          as={ rightArrowIcon }
          boxSize={ 6 }
          color="gray.500"
          transform="rotate(90deg)"
          isLoading={ isLoading }
        />
        <Box overflow="hidden" ml={ 1 }>
          <AddressEntity
            isLoading={ isLoading }
            address={ tx.from }
            fontSize="sm"
            lineHeight={ 6 }
            fontWeight="500"
            mb={ 2 }
          />
          { dataTo && (
            <AddressEntity
              isLoading={ isLoading }
              address={ dataTo }
              fontSize="sm"
              lineHeight={ 6 }
              fontWeight="500"
            />
          ) }
        </Box>
      </Grid>
      <Box>
        { !config.UI.views.tx.hiddenFields?.value && (
          <Skeleton isLoaded={ !isLoading } mb={ 2 }>
            <Text as="span" whiteSpace="pre">{ config.chain.currency.symbol } </Text>
            <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() }</Text>
          </Skeleton>
        ) }
        { !config.UI.views.tx.hiddenFields?.tx_fee && (
          <Skeleton isLoaded={ !isLoading } display="flex" whiteSpace="pre">
            <Text as="span">Fee </Text>
            { tx.stability_fee ? (
              <TxFeeStability data={ tx.stability_fee } accuracy={ 5 } color="text_secondary" hideUsd/>
            ) : (
              <Text as="span" variant="secondary">{ getValueWithUnit(tx.fee.value).dp(5).toFormat() }</Text>
            ) }
          </Skeleton>
        ) }
      </Box>
    </Grid>
  );
};

export default React.memo(LatestTxsItem);
