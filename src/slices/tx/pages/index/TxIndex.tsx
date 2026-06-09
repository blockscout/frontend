// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import PageTitle from 'src/shell/page/title/PageTitle';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';

import TxsTabs from './list/TxsTabs';
import TxsStats from './stats/TxsStats';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
};
const TABS_HEIGHT = 88;

const Transactions = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <PageTitle
        title={ config.metadata.seo.enhancedDataEnabled ? `${ config.chain.name } transactions` : 'Transactions' }
        withTextAd
      />
      <TxsStats/>
      <TxsTabs
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        tabsHeight={ TABS_HEIGHT }
      />
    </>
  );
};

export default Transactions;
