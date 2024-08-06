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
      <Box position="relative" w="100%" borderRadius={{ base: 'md', lg: 'xl' }} minW={{ base: 'unset', lg: '900px' }}>
        <Box
          position="absolute"
          top={ 0 }
          left={ 0 }
          right={ 0 }
          bottom={ 0 }
          backgroundImage={{
            sm: 'https://static.game7protocol.com/blockscout/homeplate_bg-base.png',
            md: 'https://static.game7protocol.com/blockscout/homeplate_bg-lg.png',
          }}
          backgroundSize="cover"
          backgroundPosition="center"
          borderRadius={{ base: 'md', lg: 'xl' }}
          zIndex={ -2 }
        />
        <Box //tint layer
          position="absolute"
          top={ 0 }
          left={ 0 }
          right={ 0 }
          bottom={ 0 }
          bg={{
            base: 'linear-gradient(180deg, rgba(27, 27, 27, 0) -16%, rgba(27, 27, 27, 1) 121%)',
            lg: 'linear-gradient(180deg, rgba(27, 27, 27, 0) 21%, rgba(27, 27, 27, 1) 134%)',
          }}
          //"rgba(0, 0, 0, 0)" // Adjust the tint color and transparency here
          borderRadius={{ base: 'md', lg: 'xl' }}
          zIndex={ -1 }
        />
        <Box px={{ base: 4, lg: 10 }} py={{ base: 4, lg: 10 }}>
          <Flex mb={{ base: 2, lg: 6 }} justifyContent="space-between" alignItems="center">
            <Heading
              as="h1"
              fontSize={{ base: '18px', lg: '36px' }}
              lineHeight={{ base: '24px', lg: '44px' }}
              fontWeight={ 700 }
              color={ config.UI.homepage.plate.textColor }
            >
              { config.meta.seo.enhancedDataEnabled ?
                `${ config.chain.name } blockchain explorer` :
                `${ config.chain.name } explorer` }
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
      </Box>
      <Stats/>
      <ChainIndicators/>
      <AdBanner mt={ 6 } mx="auto" display="flex" justifyContent="center"/>
      <Flex mt={ 10 } direction={{ base: 'column', lg: 'row' }} columnGap={ 10 } rowGap={ 6 }>
        { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' ? <LatestZkEvmL2Batches/> : <LatestBlocks/> }
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
