import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';

import type { AddressTags, TransactionTags } from 'types/api/account';

import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';
import AccountPageHeader from 'ui/shared/AccountPageHeader';
import Page from 'ui/shared/Page/Page';

type Props = {
  onChangeTab: (index: number) => void;
}

const PrivateTags = ({ onChangeTab: onChangeTabProps }: Props) => {
  const queryClient = useQueryClient();
  const addressData = queryClient.getQueryData([ 'address' ]) as AddressTags;
  const txData = queryClient.getQueryData([ 'transaction' ]) as TransactionTags;

  const onTabChange = useCallback((index: number) => {
    onChangeTabProps(index);
  }, [ onChangeTabProps ]);

  return (
    <Page>
      <Box h="100%">
        <AccountPageHeader text="Private tags"/>
        <Tabs variant="soft-rounded" colorScheme="blue" isLazy onChange={ onTabChange }>
          <TabList marginBottom={ 8 }>
            <Tab>Address</Tab>
            <Tab>Transaction</Tab>
          </TabList>
          <TabPanels>
            <TabPanel padding={ 0 }>
              <PrivateAddressTags addressTags={ addressData }/>
            </TabPanel>
            <TabPanel padding={ 0 }>
              <PrivateTransactionTags transactionTags={ txData }/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Page>
  );
};

export default PrivateTags;
