import { Box } from '@chakra-ui/react'; import React from 'react';

import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';
import Page from 'ui/shared/Page';
import PageHeader from 'ui/shared/PageHeader';
import type { RoutedTab } from 'ui/shared/RoutedTabs';
import RoutedTabs from 'ui/shared/RoutedTabs';

const TABS: Array<RoutedTab> = [
  { routeName: 'private_tags_address', title: 'Address', component: <PrivateAddressTags/> },
  { routeName: 'private_tags_tx', title: 'Transaction', component: <PrivateTransactionTags/> },
];

type Props = {
  tab: RoutedTab['routeName'];
}

const PrivateTags = ({ tab }: Props) => {
  return (
    <Page>
      <Box h="100%">
        <PageHeader text="Private tags"/>
        <RoutedTabs tabs={ TABS } defaultActiveTab={ tab }/>
      </Box>
    </Page>
  );
};

export default PrivateTags;
