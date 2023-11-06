import {
  Box,
  Flex,
  Grid,
  Skeleton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import type { Block } from 'types/api/block';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';

type Props = {
  block: Block;
  isLoading?: boolean;
}

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
      borderRadius="md"
      border="1px solid"
      borderColor="divider"
      p={ 6 }
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={ 3 }>
        <BlockEntity
          isLoading={ isLoading }
          number={ block.height }
          tailLength={ 2 }
          fontSize="xl"
          lineHeight={ 7 }
          fontWeight={ 500 }
          mr="auto"
        />
        <BlockTimestamp
          ts={ block.timestamp }
          isEnabled={ !isLoading }
          isLoading={ isLoading }
          fontSize="sm"
          flexShrink={ 0 }
          ml={ 2 }
        />
      </Flex>
      <Grid gridGap={ 2 } templateColumns="auto minmax(0, 1fr)" fontSize="sm">
        <Skeleton isLoaded={ !isLoading }>Txn</Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary"><span>{ block.tx_count }</span></Skeleton>

        { !config.features.optimisticRollup.isEnabled && !config.UI.views.block.hiddenFields?.total_reward && (
          <>
            <Skeleton isLoaded={ !isLoading }>Reward</Skeleton>
            <Skeleton isLoaded={ !isLoading } color="text_secondary"><span>{ totalReward.dp(10).toFixed() }</span></Skeleton>
          </>
        ) }

        { !config.features.optimisticRollup.isEnabled && (
          <>
            <Skeleton isLoaded={ !isLoading } textTransform="capitalize">{ getNetworkValidatorTitle() }</Skeleton>
            <AddressEntity
              address={ block.miner }
              isLoading={ isLoading }
              noIcon
              noCopy
            />
          </>
        ) }
      </Grid>
    </Box>
  );
};

export default LatestBlocksItem;
