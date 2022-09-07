import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import useBasePath from 'lib/hooks/useBasePath';
import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';
import AccountPageHeader from 'ui/shared/AccountPageHeader';
import Page from 'ui/shared/Page';

const TABS = [ 'address', 'transaction' ] as const;

type TabName = typeof TABS[number];

type Props = {
  tab: TabName;
}

const PrivateTags = ({ tab }: Props) => {
  const [ , setActiveTab ] = useState<TabName>(tab);

  const basePath = useBasePath();

  const onChangeTab = useCallback((index: number) => {
    setActiveTab(TABS[index]);
    const newUrl = basePath + '/account/' + (TABS[index] === 'address' ? 'tag_address' : 'tag_transaction');
    history.replaceState(history.state, '', newUrl);
  }, [ setActiveTab, basePath ]);

  return (
    <Page>
      <Box h="100%">
        <AccountPageHeader text="Private tags"/>
        <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ onChangeTab } defaultIndex={ TABS.indexOf(tab) }>
          <TabList marginBottom={{ base: 6, lg: 8 }}>
            <Tab>Address</Tab>
            <Tab>Transaction</Tab>
          </TabList>
          <TabPanels>
            <TabPanel padding={ 0 }>
              <PrivateAddressTags/>
            </TabPanel>
            <TabPanel padding={ 0 }>
              <PrivateTransactionTags/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Page>
  );
};

export default PrivateTags;
