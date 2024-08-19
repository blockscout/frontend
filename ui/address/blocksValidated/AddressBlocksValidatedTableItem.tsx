import { Td, Tr, Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = Block & {
  page: number;
  isLoading: boolean;
};

const AddressBlocksValidatedTableItem = (props: Props) => {
  const totalReward = getBlockTotalReward(props);

  return (
    <Tr>
      <Td>
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.height }
          noIcon
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 700 }
        />
      </Td>
      <Td>
        <TimeAgoWithTooltip
          timestamp={ props.timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text_secondary"
          display="inline-block"
        />
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
          <BlockGasUsed
            gasUsed={ props.gas_used }
            gasLimit={ props.gas_limit }
            isLoading={ props.isLoading }
          />
        </Flex>
      </Td>
      { !config.UI.views.block.hiddenFields?.total_reward && !config.features.rollup.isEnabled && (
        <Td isNumeric display="flex" justifyContent="end">
          <Skeleton isLoaded={ !props.isLoading } display="inline-block">
            <span>{ totalReward.toFixed() }</span>
          </Skeleton>
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(AddressBlocksValidatedTableItem);
