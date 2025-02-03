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
import { currencyUnits } from 'lib/units';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import TxFee from 'ui/shared/tx/TxFee';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
}

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
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
        <Box w="calc(100% - 40px)">
          <HStack flexWrap="wrap" my="3px">
            <TxType types={ tx.tx_types } isLoading={ isLoading }/>
            <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
            <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
          </HStack>
          <Flex
            alignItems="center"
            mt="7px"
            mb="3px"
          >
            <TxEntity
              isLoading={ isLoading }
              hash={ tx.hash }
            />
            <TimeAgoWithTooltip
              timestamp={ tx.timestamp }
              enableIncrement
              isLoading={ isLoading }
              color="grey.50"
              fontWeight="400"
              fontSize="sm"
              flexShrink={ 0 }
              ml={ 2 }
            />
          </Flex>
        </Box>
      </Flex>
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        isLoading={ isLoading }
        mode="compact"
      />
      <Flex gap="10px" justify="space-between">
        <Flex flexDir="column" justify="space-between">
          { !config.UI.views.tx.hiddenFields?.value && (
            <Skeleton isLoaded={ !isLoading } my="3px">
              <Text as="span" whiteSpace="pre" fontSize="14px">Value: </Text>
              <Text as="span" fontSize="14px" variant="secondary" color="grey.50">{ getValueWithUnit(tx.value).dp(5).toFormat() } { currencyUnits.ether }</Text>
            </Skeleton>
          ) }
          { !config.UI.views.tx.hiddenFields?.tx_fee && (
            <Skeleton isLoaded={ !isLoading } display="flex" whiteSpace="pre" my="3px">
              <Text as="span" fontSize="14px">Fee: </Text>
              <TxFee tx={ tx } accuracy={ 5 } color="grey.50"/>
            </Skeleton>
          ) }
        </Flex>
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading } my="3px"/>
      </Flex>
    </Grid>
  );
};

export default React.memo(LatestTxsItem);
