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
import AccountPageHeader from 'ui/shared/AccountPageHeader';
import Page from 'ui/shared/Page';

interface Tab {
  type: 'details' | 'internal_txn';
  path: string;
  name: string;
}
const TABS: Array<Tab> = [
  { type: 'details', path: '', name: 'Details' },
  { type: 'internal_txn', path: '/internal-transactions', name: 'Internal txn' },
];

interface Props {
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
      <AccountPageHeader text="Transaction details"/>
      <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ handleTabChange } defaultIndex={ defaultIndex }>
        <TabList marginBottom={{ base: 6, lg: 8 }}>
          { TABS.map((tab) => <Tab key={ tab.type }>{ tab.name }</Tab>) }
        </TabList>
        <TabPanels>
          <TabPanel padding={ 0 }>
            Details
          </TabPanel>
          <TabPanel padding={ 0 }>
            Internal txn
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Page>
  );
};

export default TransactionPageContent;
