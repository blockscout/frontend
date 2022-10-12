import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const TABS: Array<RoutedTab> = [
  { id: 'address', title: 'Address', component: <PrivateAddressTags/> },
  { id: 'tx', title: 'Transaction', component: <PrivateTransactionTags/> },
];

const PrivateTags = () => {
  return (
    <Page>
      <PageTitle text="Private tags"/>
      <RoutedTabs tabs={ TABS }/>
    </Page>
  );
};

export default PrivateTags;
