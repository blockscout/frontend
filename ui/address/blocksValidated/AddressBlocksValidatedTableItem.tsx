import { Td, Tr, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Block } from 'types/api/block';

import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import LinkInternal from 'ui/shared/LinkInternal';
import Utilization from 'ui/shared/Utilization/Utilization';

type Props = Block & {
  page: number;
  isLoading: boolean;
};

const AddressBlocksValidatedTableItem = (props: Props) => {
  const blockUrl = route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(props.height) } });
  const timeAgo = useTimeAgoIncrement(props.timestamp, props.page === 1);
  const totalReward = getBlockTotalReward(props);

  return (
    <Tr>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } display="inline-block">
          <LinkInternal href={ blockUrl } fontWeight="700">{ props.height }</LinkInternal>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } color="text_secondary" display="inline-block">
          <span>{ timeAgo }</span>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={ !props.isLoading } display="inline-block" fontWeight="500">
          <span>{ props.tx_count }</span>
        </Skeleton>
      </Td>
      <Td>
        <Flex alignItems="center" columnGap={ 2 }>
          <Skeleton isLoaded={ !props.isLoading } flexBasis="80px">
            { BigNumber(props.gas_used || 0).toFormat() }
          </Skeleton>
          <Utilization
            colorScheme="gray"
            value={ BigNumber(props.gas_used || 0).dividedBy(BigNumber(props.gas_limit)).toNumber() }
            isLoading={ props.isLoading }
          />
        </Flex>
      </Td>
      <Td isNumeric display="flex" justifyContent="end">
        <Skeleton isLoaded={ !props.isLoading } display="inline-block">
          <span>{ totalReward.toFixed() }</span>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressBlocksValidatedTableItem);
