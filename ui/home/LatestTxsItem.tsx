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
import getValueWithUnit from 'lib/getValueWithUnit';
import { useBlobScan } from 'lib/hooks/useBlobScan';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import { useWvmArchiver } from 'lib/hooks/useWvmArchiver';
import { currencyUnits } from 'lib/units';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import BlobScanTag from 'ui/shared/statusTag/BlobScanTag';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import WvmArchiverTag from 'ui/shared/statusTag/WvmArchiverTag';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
}

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const isBlobScan = useBlobScan({ address: tx.from.hash });
  const isWvmArchiver = useWvmArchiver({ address: tx.from.hash });
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const timeAgo = useTimeAgoIncrement(tx.timestamp || '0', true);
  const columnNum = config.UI.views.tx.hiddenFields?.value && config.UI.views.tx.hiddenFields?.tx_fee ? 2 : 3;

  return (
    <Grid
      gridTemplateColumns={{
        lg: columnNum === 2 ? '3fr minmax(auto, 180px)' : '3fr minmax(auto, 180px) 170px',
        xl: columnNum === 2 ? '3fr minmax(auto, 250px)' : '3fr minmax(auto, 275px) 170px',
      }}
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
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading } my="3px"/>
        <Box ml={ 3 } w="calc(100% - 40px)">
          <HStack flexWrap="wrap" my="3px">
            <TxType types={ tx.tx_types } isLoading={ isLoading }/>
            <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
            <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
            { isWvmArchiver && <WvmArchiverTag/> }
            { isBlobScan && <BlobScanTag/> }
          </HStack>
          <Flex
            alignItems="center"
            mt="7px"
            mb="3px"
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
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        isLoading={ isLoading }
        mode="compact"
      />
      <Flex flexDir="column">
        { !config.UI.views.tx.hiddenFields?.value && (
          <Skeleton isLoaded={ !isLoading } my="3px">
            <Text as="span" whiteSpace="pre">Value </Text>
            <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() } { currencyUnits.ether }</Text>
          </Skeleton>
        ) }
        { !config.UI.views.tx.hiddenFields?.tx_fee && (
          <Skeleton isLoaded={ !isLoading } display="flex" whiteSpace="pre" my="3px">
            <Text as="span">Fee </Text>
            { tx.stability_fee ? (
              <TxFeeStability data={ tx.stability_fee } accuracy={ 5 } color="text_secondary" hideUsd/>
            ) : (
              <Text as="span" variant="secondary">
                { tx.fee.value ? `${ getValueWithUnit(tx.fee.value).dp(5).toFormat() } ${ currencyUnits.ether }` : '-' }
              </Text>
            ) }
          </Skeleton>
        ) }
      </Flex>
    </Grid>
  );
};

export default React.memo(LatestTxsItem);
