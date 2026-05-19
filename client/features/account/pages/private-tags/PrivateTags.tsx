// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useRedirectForInvalidAuthToken from 'client/features/account/hooks/useRedirectForInvalidAuthToken';
import PrivateAddressTags from 'client/features/account/pages/private-tags/PrivateAddressTags';
import PrivateTransactionTags from 'client/features/account/pages/private-tags/PrivateTransactionTags';

import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import PageTitle from 'ui/shared/Page/PageTitle';

const TABS: Array<TabItemRegular> = [
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
