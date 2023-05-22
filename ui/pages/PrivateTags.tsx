import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import PrivateAddressTags from 'ui/privateTags/PrivateAddressTags';
import PrivateTransactionTags from 'ui/privateTags/PrivateTransactionTags';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

const TABS: Array<RoutedTab> = [
  { id: 'address', title: 'Address', component: <PrivateAddressTags/> },
  { id: 'tx', title: 'Transaction', component: <PrivateTransactionTags/> },
];

const PrivateTags = () => {
  useRedirectForInvalidAuthToken();

  return (
    <>
      <PageTitle title="Private tags"/>
      <RoutedTabs tabs={ TABS }/>
    </>
  );
};

export default PrivateTags;
