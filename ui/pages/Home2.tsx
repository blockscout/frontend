import { Box, Heading, Flex } from '@chakra-ui/react';
import React from 'react';

import LatestBlocks from 'ui/home/LatestBlocks';
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
        <SearchBar backgroundColor="white" isHomepage/>
      </Box>
      <Stats/>
      <Flex mt={ 12 }>
        <Box mr={ 12 }><LatestBlocks/></Box>
        <Box><Heading as="h4" fontSize="18px" mb={ 8 }>Latest transactions</Heading></Box>
      </Flex>
    </Page>
  );
};

export default Home;
