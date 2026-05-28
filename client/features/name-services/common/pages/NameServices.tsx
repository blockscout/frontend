// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import PageTitle from 'client/shell/page/title/PageTitle';

import Clusters from 'client/features/name-services/clusters/pages/index/Clusters';
import NameDomains from 'client/features/name-services/domains/pages/index/NameDomains';

import config from 'client/config';

import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';

const feature = config.features.nameServices;

const NameServices = () => {
  const tabs: Array<TabItemRegular> = [
    feature.isEnabled && feature.ens.isEnabled && { id: 'domains', title: 'Domains', component: <NameDomains/> },
    feature.isEnabled && feature.clusters.isEnabled && { id: 'directories', title: 'Directories', component: <Clusters/> },
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title={ config.metadata.seo.enhancedDataEnabled ? `${ config.chain.name } name services` : 'Name services lookup' }
        withTextAd
      />
      <RoutedTabs tabs={ tabs }/>
    </>
  );
};

export default NameServices;
