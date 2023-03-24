import { Text, Flex } from '@chakra-ui/react';
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
};

const AddressBlocksValidatedListItem = (props: Props) => {
  const blockUrl = route({ pathname: '/block/[height]', query: { height: props.height.toString() } });
  const timeAgo = useTimeAgoIncrement(props.timestamp, props.page === 1);
  const totalReward = getBlockTotalReward(props);

  return (
    <ListItemMobile rowGap={ 2 } isAnimated>
      <Flex justifyContent="space-between" w="100%">
        <LinkInternal href={ blockUrl } fontWeight="700">{ props.height }</LinkInternal>
        <Text variant="secondary">{ timeAgo }</Text>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Txn</Text>
        <Text variant="secondary">{ props.tx_count }</Text>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Gas used</Text>
        <Text variant="secondary">{ BigNumber(props.gas_used || 0).toFormat() }</Text>
        <Utilization colorScheme="gray" value={ BigNumber(props.gas_used || 0).dividedBy(BigNumber(props.gas_limit)).toNumber() }/>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Reward { appConfig.network.currency.symbol }</Text>
        <Text variant="secondary">{ totalReward.toFixed() }</Text>
      </Flex>
    </ListItemMobile>
  );
};

export default React.memo(AddressBlocksValidatedListItem);
