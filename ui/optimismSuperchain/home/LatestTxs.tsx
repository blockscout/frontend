import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Heading } from 'toolkit/chakra/heading';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import ChainSelect from 'ui/shared/multichain/ChainSelect';

import LatestTxsCrossChain from './LatestTxsCrossChain';
import LatestTxsLocal from './LatestTxsLocal';

const LatestTxs = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const chainSelect = useRoutedChainSelect();

  const tabs = [
    {
      id: 'cross_chain_txs',
      title: 'Cross-chain',
      component: <LatestTxsCrossChain/>,
    },
    {
      id: 'local_txs',
      title: 'Local',
      component: chainSelect.value ? <LatestTxsLocal key={ chainSelect.value[0] } chainSlug={ chainSelect.value[0] }/> : null,
    },
  ];

  const leftSlot = <Heading level="3">Latest transactions</Heading>;

  const rightSlot = tab === 'local_txs' ? (
    <ChainSelect
      loading={ false }
      value={ chainSelect.value }
      onValueChange={ chainSelect.onValueChange }
    />
  ) : null;

  return (
    <Box as="section" my={ 8 }>
      <RoutedTabs
        tabs={ tabs }
        leftSlot={ leftSlot }
        leftSlotProps={{ mr: 6 }}
        rightSlot={ rightSlot }
      />
    </Box>
  );
};

export default React.memo(LatestTxs);
