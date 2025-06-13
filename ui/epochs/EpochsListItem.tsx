import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochListItem } from 'types/api/epochs';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import EpochEntity from 'ui/shared/entities/epoch/EpochEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import CeloEpochStatus from 'ui/shared/statusTag/CeloEpochStatus';

interface Props {
  item: CeloEpochListItem;
  isLoading?: boolean;
}

const EpochsListItem = ({ item, isLoading }: Props) => {
  const communityReward = getCurrencyValue({
    value: item.distribution?.community_transfer?.value ?? '0',
    decimals: item.distribution?.community_transfer?.decimals,
    accuracy: 8,
  });
  const carbonOffsettingReward = getCurrencyValue({
    value: item.distribution?.carbon_offsetting_transfer?.value ?? '0',
    decimals: item.distribution?.carbon_offsetting_transfer?.decimals,
    accuracy: 8,
  });
  const totalReward = getCurrencyValue({
    value: item.distribution?.transfers_total?.value ?? '0',
    decimals: item.distribution?.transfers_total?.decimals,
    accuracy: 8,
  });

  return (
    <ListItemMobile rowGap={ 1 } py={ 3 } w="full" textStyle="sm" fontWeight={ 500 } alignItems="stretch">
      <HStack minH="30px" gap={ 3 }>
        <EpochEntity number={ String(item.number) }/>
        <Skeleton loading={ isLoading } color="text.secondary" fontWeight={ 400 } ml="auto"><span>{ item.type }</span></Skeleton>
        <CeloEpochStatus isFinalized={ item.is_finalized } loading={ isLoading }/>
      </HStack>
      { item.timestamp && (
        <HStack minH="30px" gap={ 0 } color="text.secondary" fontWeight={ 400 }>
          <DetailedInfoTimestamp timestamp={ item.timestamp } isLoading={ isLoading } noIcon gap={ 1 }/>
        </HStack>
      ) }
      <HStack minH="30px">
        <Box>Block range</Box>
        <Skeleton loading={ isLoading } color="text.secondary">{ item.start_block_number } - { item.end_block_number || '' }</Skeleton>
      </HStack>
      { item.distribution?.community_transfer ? (
        <HStack minH="30px">
          <Box>Community fund</Box>
          <Skeleton loading={ isLoading } color="text.secondary">{ communityReward.valueStr } { config.chain.currency.symbol }</Skeleton>
        </HStack>
      ) : null }
      { item.distribution?.carbon_offsetting_transfer ? (
        <HStack minH="30px">
          <Box>Carbon offset fund</Box>
          <Skeleton loading={ isLoading } color="text.secondary">{ carbonOffsettingReward.valueStr } { config.chain.currency.symbol }</Skeleton>
        </HStack>
      ) : null }
      { item.distribution?.transfers_total ? (
        <HStack minH="30px">
          <Box>Total fund</Box>
          <Skeleton loading={ isLoading } color="text.secondary">{ totalReward.valueStr } { config.chain.currency.symbol }</Skeleton>
        </HStack>
      ) : null }
    </ListItemMobile>
  );
};

export default EpochsListItem;
