import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import HeroBanner from 'ui/home/HeroBanner';
import HomeSubchainWidget from 'ui/homeMultichain/HomeSubchainWidget';

const HomeMultichain = () => {
  return (
    <Box as="main">
      <HeroBanner/>
      <HStack mt={ 3 } gap={ 6 }>
        { multichainConfig.chains.map(chain => (
          <HomeSubchainWidget key={ chain.id } data={ chain }/>
        )) }
      </HStack>
    </Box>
  );
};

export default React.memo(HomeMultichain);
