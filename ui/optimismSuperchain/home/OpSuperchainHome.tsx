import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'types/multichain';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import { CollapsibleList } from 'toolkit/chakra/collapsible';
import HeroBanner from 'ui/home/HeroBanner';

import ChainWidget from './ChainWidget';
import LatestTxs from './LatestTxs';
import Stats from './Stats';

const CUT_LENGTH = 4;
const COLLAPSIBLE_TRIGGER_PROPS = {
  variant: 'secondary' as const,
  display: 'block',
  w: '100%',
  textAlign: 'center',
};

const OpSuperchainHome = () => {
  const chains = multichainConfig()?.chains;

  const renderItem = React.useCallback((chain: ClusterChainConfig) => {
    return (
      <MultichainProvider key={ chain.id } chainId={ chain.id }>
        <SocketProvider url={ getSocketUrl(chain.app_config) }>
          <ChainWidget data={ chain }/>
        </SocketProvider>
      </MultichainProvider>
    );
  }, []);

  const text = React.useMemo(() => {
    const num = (chains?.length ?? 0) - CUT_LENGTH;
    return [ `+ show ${ num } more chain${ num > 1 ? 's' : '' }`, `- hide ${ num } chain${ num > 1 ? 's' : '' }` ] satisfies [string, string];
  }, [ chains?.length ]);

  return (
    <Box as="main">
      <HeroBanner/>
      <Stats/>
      <LatestTxs/>
      { chains && chains.length > 0 && (
        <CollapsibleList
          items={ chains }
          renderItem={ renderItem }
          cutLength={ CUT_LENGTH }
          flexDir="row"
          flexWrap="wrap"
          alignItems="stretch"
          gap={ 3 }
          text={ text }
          triggerProps={ COLLAPSIBLE_TRIGGER_PROPS }
        />
      ) }
    </Box>
  );
};

export default React.memo(OpSuperchainHome);
