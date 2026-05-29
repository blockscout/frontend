// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import PageTitle from 'src/shell/page/title/PageTitle';

import TokenTransfersCrossChain from 'src/features/cross-chain-txs/pages/token-transfers/TokenTransfersCrossChain';

import config from 'src/config';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import TokenTransfersLocal from './TokenTransfersLocal';

const TokenTransfers = () => {

  const tabs: Array<TabItemRegular> = [
    {
      id: 'local',
      title: 'Transfers',
      component: <TokenTransfersLocal/>,
    },
    config.features.crossChainTxs.isEnabled && {
      id: 'cross_chain',
      title: 'Cross-chain transfers',
      component: <TokenTransfersCrossChain/>,
    },
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title="Token transfers"
        withTextAd
      />
      <RoutedTabs tabs={ tabs }/>
    </>
  );
};

export default TokenTransfers;
