import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RouteName } from 'lib/link/routes';
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
  routeName: RouteName;
}

const TABS: Array<Tab> = [
  { type: 'details', routeName: 'tx_index', name: 'Details', component: <TxDetails/> },
  { type: 'internal_txn', routeName: 'tx_internal', name: 'Internal txn', component: <TxInternals/> },
  { type: 'logs', routeName: 'tx_logs', name: 'Logs', component: <TxLogs/> },
  { type: 'state', routeName: 'tx_state', name: 'State' },
  { type: 'raw_trace', routeName: 'tx_raw_trace', name: 'Raw trace' },
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
    const newUrl = link(nextTab.routeName, { id: router.query.id as string });
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
