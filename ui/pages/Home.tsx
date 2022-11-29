import { Box, Heading, Flex, LightMode } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestBlocks from 'ui/home/LatestBlocks';
import LatestTxs from 'ui/home/LatestTxs';
import Stats from 'ui/home/Stats';
import Page from 'ui/shared/Page/Page';
import ColorModeToggler from 'ui/snippets/header/ColorModeToggler';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

const Home = () => {
  return (
    <Page isHomePage>
      <Box
        w="100%"
        backgroundImage={ appConfig.homepage.plateGradient }
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
            fontWeight={ 500 }
            color="white"
          >
            Welcome to Blockscout explorer
          </Heading>
          <Flex
            alignItems="center"
            display={{ base: 'none', lg: 'flex' }}
            columnGap={ 12 }
          >
            <ColorModeToggler trackBg="whiteAlpha.500"/>
            <ProfileMenuDesktop/>
          </Flex>
        </Flex>
        <LightMode>
          <SearchBar isHomepage/>
        </LightMode>
      </Box>
      <Stats/>
      <ChainIndicators/>
      <Flex mt={ 12 } direction={{ base: 'column', lg: 'row' }}>
        <Box mr={{ base: 0, lg: 12 }} mb={{ base: 8, lg: 0 }} width={{ base: '100%', lg: '280px' }}><LatestBlocks/></Box>
        <Box flexGrow={ 1 }><LatestTxs/></Box>
      </Flex>
    </Page>
  );
};

export default Home;
