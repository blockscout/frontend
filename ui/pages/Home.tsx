import { Box, Flex, LightMode } from '@chakra-ui/react';
import React from 'react';

import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestBlocks from 'ui/home/LatestBlocks';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';
import AdBanner from 'ui/shared/ad/AdBanner';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

const Home = () => {
  return (
    <>

      <LightMode>
        <SearchBar/>
      </LightMode>

      <Stats/>
      <ChainIndicators/>
      <AdBanner mt={{ base: 6, lg: 8 }} mx="auto" display="flex" justifyContent="center"/>
      <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 8 }>
        <LatestBlocks/>
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </>
  );
};

export default Home;
