import { Heading } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useHasAccount from 'lib/hooks/useHasAccount';
import LatestDeposits from 'ui/home/LatestDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';
import TabsWithScroll from 'ui/shared/Tabs/TabsWithScroll';
const rollupFeature = config.features.rollup;

const TransactionsHome = () => {
  const hasAccount = useHasAccount();
  if ((rollupFeature.isEnabled && rollupFeature.type === 'optimistic') || hasAccount) {
    const tabs = [
      { id: 'txn', title: 'Latest txn', component: <LatestTxs/> },
      rollupFeature.isEnabled && rollupFeature.type === 'optimistic' && { id: 'deposits', title: 'Deposits (L1→L2 txn)', component: <LatestDeposits/> },
      hasAccount && { id: 'watchlist', title: 'Watch list', component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
    return (
      <>
        <Heading as="h4" size="sm" mb={ 4 }>Transactions</Heading>
        <TabsWithScroll tabs={ tabs } lazyBehavior="keepMounted"/>
      </>
    );
  }

  return (
    <>
      <Heading as="h4" size="sm" mb={ 4 }>Latest transactions</Heading>
      <LatestTxs/>
    </>
  );
};

export default TransactionsHome;
