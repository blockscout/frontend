import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import HeroBanner from 'ui/home/HeroBanner';
import HomeMultichainSocketTest from 'ui/homeMultichain/HomeMultichainSocketTest';
import HomeSubchainWidget from 'ui/homeMultichain/HomeSubchainWidget';

const socketUrl = config.apis.multichain?.socketEndpoint ? `${ config.apis.multichain.socketEndpoint }/socket` : undefined;

const HomeMultichain = () => {
  return (
    <Box as="main">
      <HeroBanner/>
      <HStack mt={ 3 } gap={ 6 }>
        { multichainConfig()?.chains.map(chain => {
          return (
            <MultichainProvider key={ chain.slug } subchainSlug={ chain.slug }>
              <SocketProvider url={ getSocketUrl(chain.config) }>
                <HomeSubchainWidget data={ chain }/>
              </SocketProvider>
            </MultichainProvider>
          );
        }) }
      </HStack>
      <SocketProvider url={ socketUrl }>
        <HomeMultichainSocketTest/>
      </SocketProvider>
    </Box>
  );
};

export default React.memo(HomeMultichain);
