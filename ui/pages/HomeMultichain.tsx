import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import HeroBanner from 'ui/home/HeroBanner';
import HomeSubchainWidget from 'ui/homeMultichain/HomeSubchainWidget';

const HomeMultichain = () => {
  return (
    <Box as="main">
      <HeroBanner/>
      <HStack mt={ 3 } gap={ 6 }>
        { multichainConfig?.chains.map(chain => {
          return (
            <MultichainProvider key={ chain.slug } subchainId={ chain.slug }>
              <SocketProvider url={ getSocketUrl(chain.config) }>
                <HomeSubchainWidget data={ chain }/>
              </SocketProvider>
            </MultichainProvider>
          );
        }) }
      </HStack>
    </Box>
  );
};

export default React.memo(HomeMultichain);
