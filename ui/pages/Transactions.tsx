import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import useLink from 'lib/link/useLink';
import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';
import TxsPending from 'ui/txs/TxsPending';
import TxsValidated from 'ui/txs/TxsValidated';

const TABS = [ 'mined', 'pending' ] as const;

type TabName = typeof TABS[number];

type Props = {
  tab: TabName;
}

const Transactions = ({ tab }: Props) => {
  const [ , setActiveTab ] = useState<TabName>(tab);

  const link = useLink();

  const onChangeTab = useCallback((index: number) => {
    setActiveTab(TABS[index]);
    const newUrl = link(TABS[index] === 'mined' ? 'txs_validated' : 'txs_pending');
    history.replaceState(history.state, '', newUrl);
  }, [ link ]);

  return (
    <Page>
      <Box h="100%">
        <PageHeader text="Private tags"/>
        <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ onChangeTab } defaultIndex={ TABS.indexOf(tab) }>
          <TabList marginBottom={{ base: 6, lg: 8 }}>
            <Tab>Validated</Tab>
            <Tab>Pending</Tab>
          </TabList>
          <TabPanels>
            <TabPanel padding={ 0 }>
              <TxsValidated/>
            </TabPanel>
            <TabPanel padding={ 0 }>
              <TxsPending/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Page>
  );
};

export default Transactions;
