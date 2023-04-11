import { Heading, Tab, Tabs, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import LatestDeposits from 'ui/home/LatestDeposits';
import LatestTxs from 'ui/home/LatestTxs';

const TransactionsHome = () => {
  if (appConfig.L2.isL2Network) {
    return (
      <>
        <Heading as="h4" size="sm" mb={ 4 }>Transactions</Heading>
        <Tabs isLazy lazyBehavior="keepMounted" defaultIndex={ 0 } variant="soft-rounded">
          <TabList>
            <Tab key="txn">Latest txn</Tab>
            <Tab key="deposits">Deposits (L1→L2 txn)</Tab>
          </TabList>
          <TabPanels mt={ 4 }>
            <TabPanel key="txn" p={ 0 }>
              <LatestTxs/>
            </TabPanel>
            <TabPanel key="deposits" p={ 0 }>
              <LatestDeposits/>
            </TabPanel>
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
