import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

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
      <PageTitle text="Private tags"/>
      <RoutedTabs tabs={ TABS } defaultActiveTab={ tab }/>
    </Page>
  );
};

export default PrivateTags;
