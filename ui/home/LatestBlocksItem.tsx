import { Box, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
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
};

const LatestBlocksItem = ({ block, isLoading }: Props) => {
  const listBgColor = useColorModeValue('white', 'blue.1000');
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
      borderColor="#7272728A"
      minWidth="300px"
      backgroundColor={ listBgColor }
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
      <Flex
        flexDirection="column"
        gridGap={ 2 }
        gridTemplateColumns="auto minmax(0, 1fr)"
        fontSize="sm"
      >
        <Flex gap="10px">
          <Skeleton isLoaded={ !isLoading } color="text_secondary">
            TXN
          </Skeleton>
          <Skeleton isLoaded={ !isLoading }>
            <span style={{ fontWeight: '500' }}>{ block.tx_count }</span>
          </Skeleton>
        </Flex>

        { !config.features.rollup.isEnabled &&
          !config.UI.views.block.hiddenFields?.total_reward && (
          <Flex gap="10px">
            <Skeleton isLoaded={ !isLoading } color="text_secondary">
                REWARDS
            </Skeleton>
            <Skeleton isLoaded={ !isLoading }>
              <span style={{ fontWeight: '500' }}>
                { totalReward.dp(10).toFixed() }
              </span>
            </Skeleton>
          </Flex>
        ) }

        { !config.features.rollup.isEnabled &&
          !config.UI.views.block.hiddenFields?.miner && (
          <Flex gap="10px">
            <Skeleton
              isLoaded={ !isLoading }
              textTransform="capitalize"
              color="text_secondary"
            >
              { getNetworkValidatorTitle().toUpperCase() }
            </Skeleton>
            <AddressEntity
              address={ block.miner }
              isLoading={ isLoading }
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
