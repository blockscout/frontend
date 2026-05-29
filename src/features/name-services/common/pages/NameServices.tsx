// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import PageTitle from 'src/shell/page/title/PageTitle';

import Clusters from 'src/features/name-services/clusters/pages/index/Clusters';
import NameDomains from 'src/features/name-services/domains/pages/index/NameDomains';

import config from 'src/config';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

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
