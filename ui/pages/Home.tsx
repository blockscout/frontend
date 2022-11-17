import { Box, Heading, Flex, LightMode } from '@chakra-ui/react';
import React from 'react';

import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestBlocks from 'ui/home/LatestBlocks';
import LatestTxs from 'ui/home/LatestTxs';
import Stats from 'ui/home/Stats';
import Page from 'ui/shared/Page/Page';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

const Home = () => {
  return (
    <Page hasSearch={ false }>
      <Box
        w="100%"
        backgroundImage="radial-gradient(farthest-corner at 0 0, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%)"
        borderRadius="24px"
        padding={{ base: '24px 40px', lg: '48px' }}
        minW={{ base: 'unset', lg: '900px' }}
      >
        <Heading
          as="h1"
          size={{ base: 'lg', ld: 'xl' }}
          fontWeight={{ base: 600, lg: 500 }}
          color="white"
          mb={{ base: 6, lg: 8 }}
        >
          Welcome to Blockscout explorer
        </Heading>
        <LightMode><SearchBar isHomepage/></LightMode>
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
