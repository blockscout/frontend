import React from 'react';

import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';

import Page from '../Page/Page';
import PrivateAddressTags from '../privateTags/PrivateAddressTags';
import PrivateTransactionTags from '../privateTags/PrivateTransactionTags';

const PrivateTags: React.FC = () => {
  return (
    <Page>
      <Box h="100%">
        <Box as="h1" textStyle="h2" marginBottom={ 8 }>Private tags</Box>
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList marginBottom={ 8 }>
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

export default PrivateTags
