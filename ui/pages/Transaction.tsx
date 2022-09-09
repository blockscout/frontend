import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useBasePath from 'lib/hooks/useBasePath';
import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';
import TxDetails from 'ui/tx/TxDetails';
import TxInternals from 'ui/tx/TxInternals';

interface Tab {
  type: 'details' | 'internal_txn' | 'logs' | 'raw_trace' | 'state';
  path: string;
  name: string;
  component?: React.ReactNode;
}

const TABS: Array<Tab> = [
  { type: 'details', path: '', name: 'Details', component: <TxDetails/> },
  { type: 'internal_txn', path: '/internal-transactions', name: 'Internal txn', component: <TxInternals/> },
  { type: 'logs', path: '/logs', name: 'Logs' },
  { type: 'state', path: '/state', name: 'State' },
  { type: 'raw_trace', path: '/raw-trace', name: 'Raw trace' },
];

export interface Props {
  tab: Tab['type'];
}

const TransactionPageContent = ({ tab }: Props) => {
  const [ , setActiveTab ] = React.useState<Tab['type']>(tab);
  const router = useRouter();
  const basePath = useBasePath();

  const handleTabChange = React.useCallback((index: number) => {
    const nextTab = TABS[index];
    setActiveTab(nextTab.type);
    const newUrl = basePath + '/tx/' + router.query.id + nextTab.path;
    window.history.replaceState(history.state, '', newUrl);
  }, [ setActiveTab, basePath, router ]);

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
