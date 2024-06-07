import { Box, Flex, Heading } from '@chakra-ui/react';
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
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';

const rollupFeature = config.features.rollup;

const Home = () => {
  return (
    <Box as="main">
      <Box
        w="100%"
        background={ config.UI.homepage.plate.background }
        borderRadius={{ base: 'md', lg: 'xl' }}
        px={{ base: 4, lg: 10 }}
        py={{ base: 3, lg: 8 }}
        minW={{ base: 'unset', lg: '900px' }}
        data-label="hero plate"
      >
        <Flex mb={{ base: 2, lg: 6 }} justifyContent="space-between" alignItems="center">
          <Heading
            as="h1"
            fontSize={{ base: '18px', lg: '40px' }}
            lineHeight={{ base: '24px', lg: '48px' }}
            fontWeight={ 600 }
            color={ config.UI.homepage.plate.textColor }
          >
            {
              config.meta.seo.enhancedDataEnabled ?
                `${ config.chain.name } blockchain explorer` :
                `${ config.chain.name } explorer`
            }
          </Heading>
          <Box display={{ base: 'none', lg: 'flex' }}>
            { config.features.account.isEnabled && <ProfileMenuDesktop isHomePage/> }
            { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop isHomePage/> }
          </Box>
        </Flex>
        <SearchBar isHomepage/>
      </Box>
      <Stats/>
      <ChainIndicators/>
      <AdBanner mt={ 6 } mx="auto" display="flex" justifyContent="center"/>
      <Flex mt={ 6 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 6 }>
        { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' ? <LatestZkEvmL2Batches/> : <LatestBlocks/> }
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
