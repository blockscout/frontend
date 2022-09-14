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
import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';
import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';

const TABS = [ 'address', 'transaction' ] as const;

type TabName = typeof TABS[number];

type Props = {
  tab: TabName;
}

const PrivateTags = ({ tab }: Props) => {
  const [ , setActiveTab ] = useState<TabName>(tab);

  const link = useLink();

  const onChangeTab = useCallback((index: number) => {
    setActiveTab(TABS[index]);
    const newUrl = link(TABS[index] === 'address' ? 'private_tags_address' : 'private_tags_tx');
    history.replaceState(history.state, '', newUrl);
  }, [ link ]);

  return (
    <Page>
      <Box h="100%">
        <PageHeader text="Private tags"/>
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
