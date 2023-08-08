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
import blockIcon from 'icons/block.svg';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';

type Props = {
  block: Block;
  h: number;
  isLoading?: boolean;
}

const LatestBlocksItem = ({ block, h, isLoading }: Props) => {
  const totalReward = getBlockTotalReward(block);
  return (
    <Box
      as={ motion.div }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      borderRadius="12px"
      border="1px solid"
      borderColor="divider"
      p={ 6 }
      h={ `${ h }px` }
      minWidth={{ base: '100%', lg: '280px' }}
      w="100%"
    >
      <Flex alignItems="center" overflow="hidden" w="100%" mb={ 3 }>
        <Icon as={ blockIcon } boxSize="30px" color="link" isLoading={ isLoading } borderRadius="base"/>
        <AddressLink
          isLoading={ isLoading }
          type="block"
          hash={ String(block.height) }
          blockHeight={ String(block.height) }
          fontSize="xl"
          fontWeight="500"
          ml={ 2 }
          mr="auto"
          tailLength={ 2 }
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
        { !config.features.rollup.isEnabled && (
          <>
            <Skeleton isLoaded={ !isLoading }>Reward</Skeleton>
            <Skeleton isLoaded={ !isLoading } color="text_secondary"><span>{ totalReward.toFixed() }</span></Skeleton>
            <Skeleton isLoaded={ !isLoading } textTransform="capitalize">{ getNetworkValidatorTitle() }</Skeleton>
            <AddressLink type="address" alias={ block.miner.name } hash={ block.miner.hash } truncation="constant" maxW="100%" isLoading={ isLoading }/>
          </>
        ) }
      </Grid>
    </Box>
  );
};

export default LatestBlocksItem;
