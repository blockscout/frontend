// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'src/slices/block/types/api';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import getBlockTotalReward from 'src/slices/block/utils/get-block-total-reward';
import { currencyUnits } from 'src/slices/chain/units';
import GasUsed from 'src/slices/gas/components/GasUsed';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobile from 'src/shared/lists/ListItemMobile';
import SimpleValue from 'src/shared/values/entity/SimpleValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

type Props = Block & {
  page: number;
  isLoading: boolean;
};

const AddressBlocksValidatedListItem = (props: Props) => {
  const totalReward = getBlockTotalReward(props);

  return (
    <ListItemMobile rowGap={ 2 }>
      <Flex justifyContent="space-between" w="100%">
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.height }
          noIcon
          fontWeight={ 700 }
        />
        <TimeWithTooltip
          timestamp={ props.timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Txn</Skeleton>
        <Skeleton loading={ props.isLoading } display="inline-block" color="Skeleton_secondary">
          <span>{ props.transactions_count }</span>
        </Skeleton>
      </Flex>
      <Flex columnGap={ 2 } w="100%">
        <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Gas used</Skeleton>
        <Skeleton loading={ props.isLoading }>
          <Text color="text.secondary">{ BigNumber(props.gas_used || 0).toFormat() }</Text>
        </Skeleton>
        <GasUsed
          gasUsed={ props.gas_used || undefined }
          gasLimit={ props.gas_limit }
          isLoading={ props.isLoading }
        />
      </Flex>
      { !config.slices.block.hiddenFields?.total_reward && !config.features.rollup.isEnabled && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton loading={ props.isLoading } fontWeight={ 500 } flexShrink={ 0 }>Reward { currencyUnits.ether }</Skeleton>
          <SimpleValue
            value={ totalReward }
            accuracy={ 0 }
            loading={ props.isLoading }
            color="text.secondary"
          />
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(AddressBlocksValidatedListItem);
