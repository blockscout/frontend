// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import { SocketProvider } from 'src/api/socket/context';

import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';

import useAuth from 'src/features/account/hooks/useIsAuth';
import LatestWatchlistTxs from 'src/features/account/pages/home/LatestWatchlistTxs';
import LatestZetaChainCCTXs from 'src/features/chain-variants/zeta-chain/pages/home/LatestZetaChainCCTXs';
import LatestCrossChainTxs from 'src/features/cross-chain-txs/pages/home/LatestCrossChainTxs';
import LatestArbitrumDeposits from 'src/features/rollup/arbitrum/pages/home/LatestArbitrumDeposits';
import { layerLabels } from 'src/features/rollup/common/utils/layer';
import LatestOptimisticDeposits from 'src/features/rollup/optimism/pages/home/LatestOptimisticDeposits';

import config from 'src/config';
import ApiDegradationRpcIcon from 'src/shared/api-degradation/ApiDegradationRpcIcon';

import { Heading } from 'src/toolkit/chakra/heading';
import AdaptiveTabs from 'src/toolkit/components/AdaptiveTabs/AdaptiveTabs';

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
          { isRpcData && <ApiDegradationRpcIcon/> }
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
          { isRpcData && <ApiDegradationRpcIcon/> }
        </HStack>
        <AdaptiveTabs tabs={ tabs } unmountOnExit={ false } listProps={{ mb: 3 }}/>
      </>
    );
  }

  return (
    <>
      <HStack mb={ 3 }>
        <Heading level="3" >Latest transactions</Heading>
        { isRpcData && <ApiDegradationRpcIcon/> }
      </HStack>
      <LatestTxs/>
    </>
  );
};

export default Transactions;
