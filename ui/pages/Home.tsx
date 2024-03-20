/* eslint-disable @next/next/no-img-element */
import { Box, Heading, Flex } from '@chakra-ui/react';
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
        borderRadius="24px"
        minW={{ base: 'unset', lg: '900px' }}
        data-label="hero plate"
        position="relative"
      >
        <Flex mb={{ base: 6, lg: 8 }} justifyContent="space-between" alignItems="center">
          <Box
            position="relative"
            zIndex={ 1 }
            padding={{ base: '24px', lg: '48px' }}
            width={{ base: '100%', lg: config.UI.homepage.plate.bgImageURL ? '48%' : '100%' }}
          >
            <Heading
              as="h1"
              size={{ base: 'md', lg: 'xl' }}
              lineHeight={{ base: '32px', lg: '50px' }}
              fontWeight={ 600 }
              marginBottom={ 4 }
              color={ config.UI.homepage.plate.textColor }
            >
              { config.UI.homepage.plate.title }
            </Heading>
            <SearchBar isHomepage/>
          </Box>
          <Box display={{ base: 'none', lg: 'flex' }} zIndex={ 1 } position="absolute" right={ 5 } top={ 5 }>
            { config.features.account.isEnabled && <ProfileMenuDesktop isHomePage/> }
            { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop isHomePage/> }
          </Box>
          {
            config.UI.homepage.plate.bgImageURL && (
              <Box display={{ base: 'none', lg: 'block' }} zIndex={ 0 } position="absolute" right={ 0 } top={ 0 } bottom={ 0 }>
                <img src={ config.UI.homepage.plate.bgImageURL } alt="" style={{
                  objectFit: 'cover',
                  objectPosition: 'right',
                  width: 'auto',
                  height: '100%',
                  marginLeft: 'auto',
                }}/>
              </Box>
            )
          }
        </Flex>
      </Box>
      <Stats/>
      <ChainIndicators/>
      <AdBanner mt={{ base: 6, lg: 8 }} mx="auto" display="flex" justifyContent="center"/>
      <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 8 }>
        { rollupFeature.isEnabled && rollupFeature.type === 'zkEvm' ? <LatestZkEvmL2Batches/> : <LatestBlocks/> }
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
