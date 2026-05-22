// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import TokenTransfersCrossChain from 'client/features/cross-chain-txs/pages/token-transfers/TokenTransfersCrossChain';

import config from 'configs/app';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import PageTitle from 'ui/shared/Page/PageTitle';

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
