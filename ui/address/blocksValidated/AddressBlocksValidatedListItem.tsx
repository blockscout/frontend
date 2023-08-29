import { Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import Utilization from 'ui/shared/Utilization/Utilization';

type Props = Block & {
  page: number;
  isLoading: boolean;
};

const AddressBlocksValidatedListItem = (props: Props) => {
  const timeAgo = useTimeAgoIncrement(props.timestamp, props.page === 1);
  const totalReward = getBlockTotalReward(props);

  return (
    <ListItemMobile rowGap={ 2 } isAnimated>
      <Flex justifyContent="space-between" w="100%">
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.height }
          noIcon
          fontWeight={ 700 }
        />
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary" display="inline-block">
          <span>{ timeAgo }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton isLoaded={ !props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txn</Skeleton>
        <Skeleton isLoaded={ !props.isLoading } display="inline-block" color="Skeleton_secondary">
          <span>{ props.tx_count }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton isLoaded={ !props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Gas used</Skeleton>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary">{ BigNumber(props.gas_used || 0).toFormat() }</Skeleton>
        <Utilization
          colorScheme="gray"
          value={ BigNumber(props.gas_used || 0).dividedBy(BigNumber(props.gas_limit)).toNumber() }
          isLoading={ props.isLoading }
        />
      </Flex>
      { !config.UI.views.block.hiddenFields?.total_reward && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton isLoaded={ !props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Reward { config.chain.currency.symbol }</Skeleton>
          <Skeleton isLoaded={ !props.isLoading } color="text_secondary">{ totalReward.toFixed() }</Skeleton>
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(AddressBlocksValidatedListItem);
