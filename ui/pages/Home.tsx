import { Box, Heading, Flex, LightMode } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestBlocks from 'ui/home/LatestBlocks';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';
import AdBanner from 'ui/shared/ad/AdBanner';
import Page from 'ui/shared/Page/Page';
import ColorModeToggler from 'ui/snippets/header/ColorModeToggler';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

const Home = () => {
  return (
    <Page isHomePage>
      <Box
        w="100%"
        backgroundImage={ appConfig.homepage.plate.gradient }
        backgroundColor="blue.400"
        borderRadius="24px"
        padding={{ base: '24px', lg: '48px' }}
        minW={{ base: 'unset', lg: '900px' }}
      >
        <Flex mb={{ base: 6, lg: 8 }} justifyContent="space-between">
          <Heading
            as="h1"
            size={{ base: 'md', lg: 'xl' }}
            lineHeight={{ base: '32px', lg: '50px' }}
            fontWeight={ 600 }
            color={ appConfig.homepage.plate.textColor }
          >
            Welcome to { appConfig.network.name } explorer
          </Heading>
          <Flex
            alignItems="center"
            display={{ base: 'none', lg: 'flex' }}
            columnGap={ 12 }
            pl={ 4 }
          >
            <ColorModeToggler trackBg="blackAlpha.900"/>
            { appConfig.isAccountSupported && <ProfileMenuDesktop/> }
          </Flex>
        </Flex>
        <LightMode>
          <SearchBar isHomepage/>
        </LightMode>
      </Box>
      <Stats/>
      <ChainIndicators/>
      <AdBanner mt={{ base: 6, lg: 8 }} justifyContent="center"/>
      <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 8 }>
        <LatestBlocks/>
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </Page>
  );
};

export default Home;
