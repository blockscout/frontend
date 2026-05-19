// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import { SocketProvider } from 'client/api/socket/context';

import { useHomeRpcDataContext } from 'client/slices/home/contexts/rpc-data-context';

import useAuth from 'client/features/account/hooks/useIsAuth';
import LatestWatchlistTxs from 'client/features/account/pages/home/LatestWatchlistTxs';
import LatestZetaChainCCTXs from 'client/features/chain-variants/zeta-chain/pages/home/LatestZetaChainCCTXs';
import LatestCrossChainTxs from 'client/features/cross-chain-txs/pages/home/LatestCrossChainTxs';
import LatestArbitrumDeposits from 'client/features/rollup/arbitrum/pages/home/LatestArbitrumDeposits';
import { layerLabels } from 'client/features/rollup/common/utils/layer';
import LatestOptimisticDeposits from 'client/features/rollup/optimism/pages/home/LatestOptimisticDeposits';

import config from 'configs/app';
import { Heading } from 'toolkit/chakra/heading';
import AdaptiveTabs from 'toolkit/components/AdaptiveTabs/AdaptiveTabs';
import FallbackRpcIcon from 'ui/shared/fallbacks/FallbackRpcIcon';

import LatestTxs from './LatestTxs';

const rollupFeature = config.features.rollup;
const zetachainFeature = config.features.zetachain;
const crossChainTxsFeature = config.features.crossChainTxs;

const Transactions = () => {

  const isAuth = useAuth();
  const rpcDataContext = useHomeRpcDataContext();
  const isRpcData = rpcDataContext.isEnabled && !rpcDataContext.isLoading && !rpcDataContext.isError && rpcDataContext.subscriptions.includes('latest-txs');

  if ((rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'arbitrum')) || isAuth || zetachainFeature.isEnabled) {
    const tabs = [
      zetachainFeature.isEnabled && {
        id: 'cctx',
        title: 'Cross-chain',
        component: (
          <SocketProvider url={ config.apis.zetachain?.socketEndpoint } name="zetachain">
            <LatestZetaChainCCTXs/>
          </SocketProvider>
        ),
      },
      { id: 'txn', title: zetachainFeature.isEnabled ? 'ZetaChain EVM' : 'Latest txn', component: <LatestTxs/> },
      rollupFeature.isEnabled && rollupFeature.type === 'optimistic' &&
        { id: 'deposits', title: `Deposits (${ layerLabels.parent }→${ layerLabels.current } txn)`, component: <LatestOptimisticDeposits/> },
      rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' &&
        { id: 'deposits', title: `Deposits (${ layerLabels.parent }→${ layerLabels.current } txn)`, component: <LatestArbitrumDeposits/> },
      isAuth && { id: 'watchlist', title: 'Watch list', component: <LatestWatchlistTxs/> },
    ].filter(Boolean);
    return (
      <>
        <HStack mb={ 3 }>
          <Heading level="3" >Transactions</Heading>
          { isRpcData && <FallbackRpcIcon/> }
        </HStack>
        <AdaptiveTabs tabs={ tabs } unmountOnExit={ false } listProps={{ mb: 3 }}/>
      </>
    );
  }

  if (crossChainTxsFeature.isEnabled) {
    const tabs = [
      { id: 'txs', title: 'Txns', component: <LatestTxs/> },
      { id: 'cross_chain_txs', title: 'Cross-chain txns', component: <LatestCrossChainTxs/> },
    ];

    return (
      <>
        <HStack mb={ 3 }>
          <Heading level="3" >Latest transactions</Heading>
          { isRpcData && <FallbackRpcIcon/> }
        </HStack>
        <AdaptiveTabs tabs={ tabs } unmountOnExit={ false } listProps={{ mb: 3 }}/>
      </>
    );
  }

  return (
    <>
      <HStack mb={ 3 }>
        <Heading level="3" >Latest transactions</Heading>
        { isRpcData && <FallbackRpcIcon/> }
      </HStack>
      <LatestTxs/>
    </>
  );
};

export default Transactions;
