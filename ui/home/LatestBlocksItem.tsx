import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import type { Block } from 'types/api/block';

import blockIcon from 'icons/block.svg';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import link from 'lib/link/link';
import BlockTimestamp from 'ui/blocks/BlockTimestamp';
import AddressLink from 'ui/shared/address/AddressLink';

type Props = {
  block: Block;
  h: number;
}

const LatestBlocksItem = ({ block, h }: Props) => {
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
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      p={ 6 }
      h={ `${ h }px` }
      minWidth={{ base: '100%', lg: '280px' }}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={ 3 }>
        <HStack spacing={ 2 }>
          <Icon as={ blockIcon } boxSize="30px" color={ useColorModeValue('blue.600', 'blue.300') }/>
          <Link
            href={ link('block', { id: String(block.height) }) }
            fontSize="xl"
            fontWeight="500"
          >
            { block.height }
          </Link>
        </HStack>
        <BlockTimestamp ts={ block.timestamp } isEnabled fontSize="sm"/>
      </Flex>
      <Grid gridGap={ 2 } templateColumns="auto minmax(0, 1fr)" fontSize="sm">
        <GridItem>Txn</GridItem>
        <GridItem><Text variant="secondary">{ block.tx_count }</Text></GridItem>
        { /*  */ }
        <GridItem>Reward</GridItem>
        <GridItem><Text variant="secondary">{ totalReward.toFixed() }</Text></GridItem>
        <GridItem>Miner</GridItem>
        <GridItem><AddressLink type="address" alias={ block.miner.name } hash={ block.miner.hash } truncation="constant" maxW="100%"/></GridItem>
      </Grid>
    </Box>
  );
};

export default LatestBlocksItem;
