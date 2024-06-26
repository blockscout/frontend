import { Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
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
  const isMobile = useIsMobile();

  return (
    <Box as="main">
      <Flex
        w="100%"
        background={ config.UI.homepage.plate.background }
        borderRadius="md"
        p={{ base: 4, lg: 8 }}
        columnGap={ 8 }
        alignItems="center"
        data-label="hero plate"
      >
        <Box flexGrow={ 1 }>
          <Flex mb={{ base: 2, lg: 3 }} justifyContent="space-between" alignItems="center" columnGap={ 2 }>
            <Heading
              as="h1"
              fontSize={{ base: '18px', lg: '30px' }}
              lineHeight={{ base: '24px', lg: '36px' }}
              fontWeight={{ base: 500, lg: 700 }}
              color={ config.UI.homepage.plate.textColor }
            >
              {
                config.meta.seo.enhancedDataEnabled ?
                  `${ config.chain.name } blockchain explorer` :
                  `${ config.chain.name } explorer`
              }
            </Heading>
            { config.UI.navigation.layout === 'vertical' && (
              <Box display={{ base: 'none', lg: 'flex' }}>
                { config.features.account.isEnabled && <ProfileMenuDesktop isHomePage/> }
                { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop isHomePage/> }
              </Box>
            ) }
          </Flex>
          <SearchBar isHomepage/>
        </Box>
        { !isMobile && <AdBanner platform="mobile" w="fit-content" flexShrink={ 0 } borderRadius="md" overflow="hidden"/> }
      </Flex>
      <Flex flexDir={{ base: 'column', lg: 'row' }} columnGap={ 2 } rowGap={ 1 } mt={ 3 } _empty={{ mt: 0 }}>
        <Stats/>
        <ChainIndicators/>
      </Flex>
      { isMobile && <AdBanner mt={ 6 } mx="auto" display="flex" justifyContent="center"/> }
      <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 6 }>
        { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' ? <LatestZkEvmL2Batches/> : <LatestBlocks/> }
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
