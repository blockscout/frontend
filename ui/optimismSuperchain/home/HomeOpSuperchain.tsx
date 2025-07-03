import { Box, HStack } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import HeroBanner from 'ui/home/HeroBanner';

import ChainWidget from './ChainWidget';
import LatestTxs from './LatestTxs';

const HomeOpSuperchain = () => {
  return (
    <Box as="main">
      <HeroBanner/>
      <LatestTxs/>
      <HStack mt={ 3 } gap={ 3 } flexWrap="wrap" alignItems="stretch">
        { multichainConfig()?.chains.map(chain => {
          return (
            <MultichainProvider key={ chain.slug } chainSlug={ chain.slug }>
              <SocketProvider url={ getSocketUrl(chain.config) }>
                <ChainWidget data={ chain }/>
              </SocketProvider>
            </MultichainProvider>
          );
        }) }
      </HStack>
    </Box>
  );
};

export default React.memo(HomeOpSuperchain);
