import { Heading } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import LatestOptimisticDeposits from 'ui/home/latestDeposits/LatestOptimisticDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';
import TabsWithScroll from 'ui/shared/Tabs/TabsWithScroll';
import useAuth from 'ui/snippets/auth/useIsAuth';

import LatestArbitrumDeposits from './latestDeposits/LatestArbitrumDeposits';

const rollupFeature = config.features.rollup;

const TAB_LIST_PROPS = {
  mb: { base: 3, lg: 3 },
};

const TransactionsHome = () => {
  const isAuth = useAuth();
  if ((rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'arbitrum')) || isAuth) {
    const tabs = [
      { id: 'txn', title: 'Latest txn', component: <LatestTxs/> },
      rollupFeature.isEnabled && rollupFeature.type === 'optimistic' &&
        { id: 'deposits', title: 'Deposits (L1→L2 txn)', component: <LatestOptimisticDeposits/> },
      rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' &&
        { id: 'deposits', title: 'Deposits (L1→L2 txn)', component: <LatestArbitrumDeposits/> },
      isAuth && { id: 'watchlist', title: 'Watch list', component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
    return (
      <>
        <Heading as="h4" size="sm" mb={ 3 }>Transactions</Heading>
        <TabsWithScroll tabs={ tabs } lazyBehavior="keepMounted" tabListProps={ TAB_LIST_PROPS }/>
      </>
    );
  }

  return (
    <>
      <Heading as="h4" size="sm" mb={ 3 }>Latest transactions</Heading>
      <LatestTxs/>
    </>
  );
};

export default TransactionsHome;
