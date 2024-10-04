import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import HeroBanner from 'ui/home/HeroBanner';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestArbitrumL2Batches from 'ui/home/latestBatches/LatestArbitrumL2Batches';
import LatestZkEvmL2Batches from 'ui/home/latestBatches/LatestZkEvmL2Batches';
import LatestBlocks from 'ui/home/LatestBlocks';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';
import AdBanner from 'ui/shared/ad/AdBanner';

const rollupFeature = config.features.rollup;

const Home = () => {
  return (
    <Box as="main">
      <HeroBanner/>
      <Flex flexDir={{ base: 'column', lg: 'row' }} columnGap={ 2 } rowGap={ 1 } mt={ 3 } _empty={{ mt: 0 }}>
        <Stats/>
        <ChainIndicators/>
      </Flex>
      <AdBanner mt={ 6 } mx="auto" display={{ base: 'flex', lg: 'none' }} justifyContent="center"/>
      <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 6 }>
        { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' && <LatestZkEvmL2Batches/> }
        { rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && <LatestArbitrumL2Batches/> }
        { !(rollupFeature.isEnabled && (rollupFeature.type === 'arbitrum' || rollupFeature.type === 'zkEvm')) && <LatestBlocks/> }
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
