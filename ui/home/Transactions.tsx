import { Heading, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import useHasAccount from 'lib/hooks/useHasAccount';
import LatestDeposits from 'ui/home/LatestDeposits';
import LatestTxs from 'ui/home/LatestTxs';
import LatestWatchlistTxs from 'ui/home/LatestWatchlistTxs';

const TransactionsHome = () => {
  const hasAccount = useHasAccount();
  if (appConfig.L2.isL2Network || hasAccount) {
    return (
      <>
        <Heading as="h4" size="sm" mb={ 4 }>Transactions</Heading>
        <Tabs isLazy lazyBehavior="keepMounted" defaultIndex={ 0 } variant="soft-rounded">
          <TabList>
            <Tab key="txn">Latest txn</Tab>
            { appConfig.L2.isL2Network && <Tab key="deposits">Deposits (L1→L2 txn)</Tab> }
            { hasAccount && <Tab key="deposits">Watch list</Tab> }
          </TabList>
          <TabPanels mt={ 4 }>
            <TabPanel key="txn" p={ 0 }>
              <LatestTxs/>
            </TabPanel>
            { appConfig.L2.isL2Network && (
              <TabPanel key="deposits" p={ 0 }>
                <LatestDeposits/>
              </TabPanel>
            ) }
            { hasAccount && (
              <TabPanel key="deposits" p={ 0 }>
                <LatestWatchlistTxs/>
              </TabPanel>
            ) }
          </TabPanels>
        </Tabs>
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
