import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import { SocketProvider } from 'lib/socket/context';
import HeroBanner from 'ui/home/HeroBanner';
import HomeSubchainWidget from 'ui/homeMultichain/HomeSubchainWidget';

const HomeMultichain = () => {
  return (
    <Box as="main">
      <HeroBanner/>
      <HStack mt={ 3 } gap={ 6 }>
        { multichainConfig.chains.map(chain => (
          <SocketProvider key={ chain.id } url={ chain.apis.general.socketEndpoint }>
            <HomeSubchainWidget data={ chain }/>
          </SocketProvider>
        )) }
      </HStack>
    </Box>
  );
};

export default React.memo(HomeMultichain);
