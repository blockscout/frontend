import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import config from 'configs/app';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import Clusters from 'ui/nameDomains/directories/Clusters';
import NameDomainsContent from 'ui/nameDomains/domains/NameDomainsContent';
import PageTitle from 'ui/shared/Page/PageTitle';

const NameDomains = () => {
  const tabs: Array<TabItemRegular> = [
    config.features.nameService.isEnabled && { id: 'domains', title: 'Domains', component: <NameDomainsContent/> },
    config.features.clusters.isEnabled && { id: 'directories', title: 'Directories', component: <Clusters/> },
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } name domains` : 'Name services lookup' }
        withTextAd
      />
      <RoutedTabs tabs={ tabs }/>
    </>
  );
};

export default NameDomains;
