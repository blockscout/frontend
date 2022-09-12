import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useLink from 'lib/link/useLink';
import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';
import TxDetails from 'ui/tx/TxDetails';
import TxInternals from 'ui/tx/TxInternals';
import TxLogs from 'ui/tx/TxLogs';

interface Tab {
  type: 'details' | 'internal_txn' | 'logs' | 'raw_trace' | 'state';
  name: string;
  path?: string;
  component?: React.ReactNode;
}

const TABS: Array<Tab> = [
  { type: 'details', name: 'Details', component: <TxDetails/> },
  { type: 'internal_txn', path: 'internal-transactions', name: 'Internal txn', component: <TxInternals/> },
  { type: 'logs', path: 'logs', name: 'Logs', component: <TxLogs/> },
  { type: 'state', path: 'state', name: 'State' },
  { type: 'raw_trace', path: 'raw-trace', name: 'Raw trace' },
];

export interface Props {
  tab: Tab['type'];
}

const TransactionPageContent = ({ tab }: Props) => {
  const [ , setActiveTab ] = React.useState<Tab['type']>(tab);
  const router = useRouter();
  const link = useLink();

  const handleTabChange = React.useCallback((index: number) => {
    const nextTab = TABS[index];
    setActiveTab(nextTab.type);
    const newUrl = link('tx', { id: router.query.id as string, tab: nextTab.path });
    window.history.replaceState(history.state, '', newUrl);
  }, [ setActiveTab, link, router.query.id ]);

  const defaultIndex = TABS.map(({ type }) => type).indexOf(tab);

  return (
    <Page>
      <PageHeader text="Transaction details"/>
      <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ handleTabChange } defaultIndex={ defaultIndex }>
        <TabList marginBottom={{ base: 6, lg: 8 }} flexWrap="wrap">
          { TABS.map((tab) => <Tab key={ tab.type }>{ tab.name }</Tab>) }
        </TabList>
        <TabPanels>
          { TABS.map((tab) => <TabPanel padding={ 0 } key={ tab.type }>{ tab.component || tab.name }</TabPanel>) }
        </TabPanels>
      </Tabs>
    </Page>
  );
};

export default TransactionPageContent;
