// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'client/slices/tx/types/api';

import AddressFromTo from 'client/slices/address/components/from-to/AddressFromTo';
import TxEntity from 'client/slices/tx/components/entity/TxEntity';
import TxAdditionalInfo from 'client/slices/tx/components/TxAdditionalInfo';
import TxFee from 'client/slices/tx/components/TxFee';
import TxStatus from 'client/slices/tx/components/TxStatus';
import TxType from 'client/slices/tx/components/TxType';

import TxWatchListTags from 'client/features/account/components/TxWatchListTags';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
};

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const protocolTag = tx.to?.metadata?.tags?.find(tag => tag.tagType === 'protocol');

  return (
    <Box
      width="100%"
      borderBottom="1px solid"
      borderColor="border.divider"
      py={ 4 }
      display={{ base: 'block', lg: 'none' }}
    >
      <Flex justifyContent="space-between">
        <HStack>
          <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          { tx.status !== 'ok' && <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/> }
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
          { protocolTag && <EntityTag data={ protocolTag } isLoading={ isLoading } minW="0" noColors/> }
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
        <TimeWithTooltip
          timestamp={ tx.timestamp }
          enableIncrement
          timeFormat="relative"
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          ml={ 3 }
        />
      </Flex>
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        isLoading={ isLoading }
        fontWeight="500"
      />
      { !(config.UI.views.tx.hiddenFields?.value && config.UI.views.tx.hiddenFields?.tx_fee) ? (
        <VStack rowGap={ 2 } mt={ 3 } alignItems="flex-start">
          { !config.UI.views.tx.hiddenFields?.value && (
            <Skeleton loading={ isLoading } w="fit-content">
              <Text as="span">Value </Text>
              <NativeCoinValue
                amount={ tx.value }
                accuracy={ 5 }
                loading={ isLoading }
                color="text.secondary"
              />
            </Skeleton>
          ) }
          { !config.UI.views.tx.hiddenFields?.tx_fee && (
            <Skeleton loading={ isLoading } w="fit-content" display="flex" whiteSpace="pre">
              <Text as="span">Fee </Text>
              <TxFee tx={ tx } accuracy={ 5 } color="text.secondary" noUsd/>
            </Skeleton>
          ) }
        </VStack>
      ) : null }
    </Box>
  );
};

export default React.memo(LatestTxsItem);
