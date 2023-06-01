import {
  Box,
  Flex,
  Grid,
  HStack,
  Skeleton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Block } from 'types/api/block';

import appConfig from 'configs/app/config';
import blockIcon from 'icons/block.svg';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import LinkInternal from 'ui/shared/LinkInternal';

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
    >
      <Flex justifyContent="space-between" alignItems="center" mb={ 3 }>
        <HStack spacing={ 2 }>
          <Icon as={ blockIcon } boxSize="30px" color="link" isLoading={ isLoading } borderRadius="base"/>
          <LinkInternal
            href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(block.height) } }) }
            fontSize="xl"
            fontWeight="500"
            isLoading={ isLoading }
          >
            <Skeleton isLoaded={ !isLoading }>
              { block.height }
            </Skeleton>
          </LinkInternal>
        </HStack>
        <BlockTimestamp ts={ block.timestamp } isEnabled={ !isLoading } isLoading={ isLoading } fontSize="sm"/>
      </Flex>
      <Grid gridGap={ 2 } templateColumns="auto minmax(0, 1fr)" fontSize="sm">
        <Skeleton isLoaded={ !isLoading }>Txn</Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary"><span>{ block.tx_count }</span></Skeleton>
        { !appConfig.L2.isL2Network && (
          <>
            <Skeleton isLoaded={ !isLoading }>Reward</Skeleton>
            <Skeleton isLoaded={ !isLoading } color="text_secondary"><span>{ totalReward.toFixed() }</span></Skeleton>
            <Skeleton isLoaded={ !isLoading }>Miner</Skeleton>
            <AddressLink type="address" alias={ block.miner.name } hash={ block.miner.hash } truncation="constant" maxW="100%" isLoading={ isLoading }/>
          </>
        ) }
      </Grid>
    </Box>
  );
};

export default LatestBlocksItem;
