import { Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import LinkInternal from 'ui/shared/LinkInternal';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import Utilization from 'ui/shared/Utilization/Utilization';

type Props = Block & {
  page: number;
  isLoading: boolean;
};

const AddressBlocksValidatedListItem = (props: Props) => {
  const blockUrl = route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: props.height.toString() } });
  const timeAgo = useTimeAgoIncrement(props.timestamp, props.page === 1);
  const totalReward = getBlockTotalReward(props);

  return (
    <ListItemMobile rowGap={ 2 } isAnimated>
      <Flex justifyContent="space-between" w="100%">
        <Skeleton isLoaded={ !props.isLoading } display="inline-block">
          <LinkInternal href={ blockUrl } fontWeight="700">{ props.height }</LinkInternal>
        </Skeleton>
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
      <Flex columnGap={ 2 } w="100%">
        <Skeleton isLoaded={ !props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Reward { appConfig.network.currency.symbol }</Skeleton>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary">{ totalReward.toFixed() }</Skeleton>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(AddressBlocksValidatedListItem);
