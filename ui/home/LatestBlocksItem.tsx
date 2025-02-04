import {
  Box,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

type Props = {
  block: Block;
  isLoading?: boolean;
};

const LatestBlocksItem = ({ block, isLoading }: Props) => {
  const totalReward = getBlockTotalReward(block);
  return (
    <Box
      as={ motion.div }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ display: 'none' }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      borderRadius="12px"
      border="1px solid"
      borderColor="grey.30"
      p={ 3 }
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={ 3 }>
        <BlockEntity
          isLoading={ isLoading }
          number={ block.height }
          tailLength={ 2 }
          fontSize="xl"
          color="cyan"
          lineHeight={ 7 }
          fontWeight={ 500 }
          mr="auto"
        />
        <TimeAgoWithTooltip
          timestamp={ block.timestamp }
          enableIncrement={ !isLoading }
          isLoading={ isLoading }
          color="grey.50"
          fontWeight={ 400 }
          display="inline-block"
          fontSize="sm"
          flexShrink={ 0 }
          ml={ 2 }
        />
      </Flex>
      <Flex gap={ 2 } direction="column" fontSize="sm">
        <Flex justify="space-between">
          <Skeleton isLoaded={ !isLoading } color="grey.50">Txn</Skeleton>
          <Skeleton isLoaded={ !isLoading } color="white"><span>{ block.transaction_count }</span></Skeleton>
        </Flex>

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.total_reward && (
          <Flex justify="space-between">
            <Skeleton isLoaded={ !isLoading } color="grey.50">Reward</Skeleton>
            <Skeleton isLoaded={ !isLoading } color="white"><span>{ totalReward.dp(10).toFixed() }</span></Skeleton>
          </Flex>
        ) }

        { !config.features.rollup.isEnabled && !config.UI.views.block.hiddenFields?.miner && (
          <Flex justify="space-between">
            <Skeleton isLoaded={ !isLoading } color="grey.50" textTransform="capitalize">{ getNetworkValidatorTitle() }</Skeleton>
            <AddressEntity
              address={ block.miner }
              isLoading={ isLoading }
              color="white"
              noIcon
              noCopy
              truncation="constant"
            />
          </Flex>
        ) }
      </Flex>
    </Box>
  );
};

export default LatestBlocksItem;
