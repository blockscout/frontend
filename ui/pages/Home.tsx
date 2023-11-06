import { Box, Heading, Flex, LightMode } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestBlocks from 'ui/home/LatestBlocks';
import LatestZkEvmL2Batches from 'ui/home/LatestZkEvmL2Batches';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';
import AdBanner from 'ui/shared/ad/AdBanner';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

const Home = () => {
  return (
    <Box as="main">
      <Box
        w="100%"
        background={ config.UI.homepage.plate.background }
        borderRadius="24px"
        padding={{ base: '24px', lg: '48px' }}
        minW={{ base: 'unset', lg: '900px' }}
        data-label="hero plate"
      >
        <Flex mb={{ base: 6, lg: 8 }} justifyContent="space-between">
          <Heading
            as="h1"
            size={{ base: 'md', lg: 'xl' }}
            lineHeight={{ base: '32px', lg: '50px' }}
            fontWeight={ 600 }
            color={ config.UI.homepage.plate.textColor }
          >
            Welcome to { config.chain.name } explorer
          </Heading>
          <Box display={{ base: 'none', lg: 'block' }}>
            { config.features.account.isEnabled && <ProfileMenuDesktop/> }
          </Box>
        </Flex>
        <LightMode>
          <SearchBar isHomepage/>
        </LightMode>
      </Box>
      <Stats/>
      <ChainIndicators/>
      <AdBanner mt={{ base: 6, lg: 8 }} mx="auto" display="flex" justifyContent="center"/>
      <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 8 }>
        { config.features.zkEvmRollup.isEnabled ? <LatestZkEvmL2Batches/> : <LatestBlocks/> }
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
