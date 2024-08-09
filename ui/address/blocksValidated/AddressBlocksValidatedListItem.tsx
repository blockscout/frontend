import { Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import { currencyUnits } from 'lib/units';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = Block & {
  page: number;
  isLoading: boolean;
};

const AddressBlocksValidatedListItem = (props: Props) => {
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
        <TimeAgoWithTooltip
          timestamp={ props.timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text_secondary"
          display="inline-block"
        />
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
        <BlockGasUsed
          gasUsed={ props.gas_used }
          gasLimit={ props.gas_limit }
          isLoading={ props.isLoading }
        />
      </Flex>
      { !config.UI.views.block.hiddenFields?.total_reward && !config.features.rollup.isEnabled && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton isLoaded={ !props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Reward { currencyUnits.ether }</Skeleton>
          <Skeleton isLoaded={ !props.isLoading } color="text_secondary">{ totalReward.toFixed() }</Skeleton>
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(AddressBlocksValidatedListItem);
