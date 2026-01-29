import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { MultichainProvider } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import getQueryParamString from 'lib/router/getQueryParamString';
import { EmptyState } from 'toolkit/chakra/empty-state';
import { Heading } from 'toolkit/chakra/heading';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import ChainSelect from 'ui/optimismSuperchain/components/ChainSelect';

import LatestTxsLocal from './LatestTxsLocal';

const LatestTxs = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const chainSelect = useRoutedChainSelect();

  const isLocalTab = tab === 'txs_local' || !tab;

  const tabs = [
    {
      id: 'cross_chain_txs',
      title: 'Cross-chain',
      component: <EmptyState type="coming_soon" my={ 6 }/>,
    },
    {
      id: 'txs_local',
      title: 'Local',
      component: chainSelect.value ? (
        <MultichainProvider chainId={ chainSelect.value[0] }>
          <LatestTxsLocal/>
        </MultichainProvider>
      ) : null,
    },
  ];

  const heading = <Heading level="3" mb={{ base: 3, lg: 0 }}>Latest transactions</Heading>;

  const rightSlot = isLocalTab ? (
    <ChainSelect
      loading={ false }
      value={ chainSelect.value }
      onValueChange={ chainSelect.onValueChange }
    />
  ) : null;

  return (
    <Box as="section" my={ 8 }>
      { isMobile && heading }
      <RoutedTabs
        tabs={ tabs }
        defaultTabId="txs_local"
        listProps={{ mb: 3 }}
        leftSlot={ !isMobile ? heading : null }
        leftSlotProps={{ mr: 6 }}
        rightSlot={ rightSlot }
        rightSlotProps={{ ml: { base: 'auto', lg: 6 } }}
      />
    </Box>
  );
};

export default React.memo(LatestTxs);
