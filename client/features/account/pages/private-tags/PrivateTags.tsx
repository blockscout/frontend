// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useRedirectForInvalidAuthToken from 'client/features/account/hooks/useRedirectForInvalidAuthToken';

import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import PageTitle from 'ui/shared/Page/PageTitle';

import PrivateAddressTags from './PrivateAddressTags';
import PrivateTransactionTags from './PrivateTransactionTags';

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
