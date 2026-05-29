// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { HomeDataContextProvider } from 'client/slices/home/contexts/home-data-context';
import { HomeRpcDataContextProvider } from 'client/slices/home/contexts/rpc-data-context';

import AdBanner from 'client/features/ads/banner/components/AdBanner';
import LatestArbitrumL2Batches from 'client/features/rollup/arbitrum/pages/home/LatestArbitrumL2Batches';

import config from 'client/config';
import useIsMobile from 'client/shared/hooks/useIsMobile';

import LatestBlocks from './blocks/LatestBlocks';
import ChainIndicators from './charts/ChainIndicators';
import HeroBanner from './HeroBanner';
import Highlights from './highlights/Highlights';
import Stats from './stats/Stats';
import Transactions from './txs/Transactions';

const rollupFeature = config.features.rollup;

const Home = () => {
  const isMobile = useIsMobile();

  const leftWidget = (() => {
    if (rollupFeature.isEnabled && !rollupFeature.homepage.showLatestBlocks) {
      switch (rollupFeature.type) {
        case 'arbitrum':
          return <LatestArbitrumL2Batches/>;
      }
    }

    return <LatestBlocks/>;
  })();

  return (
    <HomeDataContextProvider>
      <HomeRpcDataContextProvider>
        <Box as="main">
          <HeroBanner/>
          <Flex flexDir={{ base: 'column', lg: 'row' }} columnGap={ 2 } rowGap={ 1 } mt={ 3 } _empty={{ mt: 0 }}>
            <Stats/>
            <ChainIndicators/>
          </Flex>
          { !isMobile && config.slices.home.highlights && <Highlights mt={ 3 }/> }
          { isMobile && <AdBanner mt={ 6 } mx="auto" justifyContent="center" format="mobile"/> }
          <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 6 }>
            { leftWidget }
            <Box flexGrow={ 1 }>
              <Transactions/>
            </Box>
          </Flex>
        </Box>
      </HomeRpcDataContextProvider>
    </HomeDataContextProvider>
  );
};

export default Home;
