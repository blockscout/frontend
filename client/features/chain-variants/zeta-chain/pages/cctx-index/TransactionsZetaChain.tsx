// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { SocketProvider } from 'client/api/socket/context';

import TxsWithFrontendSorting from 'client/slices/tx/pages/index/list/TxsWithFrontendSorting';
import TxsStats from 'client/slices/tx/pages/index/stats/TxsStats';
import { TX } from 'client/slices/tx/stubs/tx';

import useIsAuth from 'client/features/account/hooks/useIsAuth';
import TxsWatchlist from 'client/features/account/pages/tx-index-watchlist/TxsWatchlist';

import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import config from 'configs/app';
import { generateListStub } from 'stubs/utils';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import ActionBar from 'ui/shared/ActionBar';
import AdvancedFilterLink from 'ui/shared/links/AdvancedFilterLink';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import ZetaChainCCTXsTab from './ZetaChainCCTXsTab';
import ZetaChainEvmTransactions from './ZetaChainEvmTransactions';

const ZETACHAIN_TABS = [ 'zetachain_validated', 'zetachain_pending' ];
const CROSS_CHAIN_TABS = [ 'cctx_pending', 'cctx_mined' ];

const TransactionsZetaChain = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const tab = getQueryParamString(router.query.tab);

  const txsWithBlobsQuery = useQueryWithPages({
    resourceName: 'general:txs_with_blobs',
    filters: { type: 'blob_transaction' },
    options: {
      enabled: config.features.dataAvailability.isEnabled && tab === 'blob_txs',
      placeholderData: generateListStub<'general:txs_with_blobs'>(TX, 50, { next_page_params: {
        block_number: 10602877,
        index: 8,
        items_count: 50,
      } }),
    },
  });

  const txsWatchlistQuery = useQueryWithPages({
    resourceName: 'general:txs_watchlist',
    options: {
      enabled: tab === 'watchlist',
      placeholderData: generateListStub<'general:txs_watchlist'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const isAuth = useIsAuth();

  // for cctxs and evm txs we show pagination with the secondary tabs
  const pagination = (() => {
    switch (tab) {
      case 'watchlist': return txsWatchlistQuery.pagination;
      case 'blob_txs': return txsWithBlobsQuery.pagination;
      default: return null;
    }
  })();

  const topRow = (() => {
    if (isMobile) {
      return null;
    }

    if (tab !== 'blob_txs' && tab !== 'watchlist') {
      return null;
    }

    const isAdvancedFilterEnabled = config.features.advancedFilter.isEnabled;

    if (!isAdvancedFilterEnabled && !pagination?.isVisible) {
      return null;
    }

    return (
      <ActionBar
        mt={ -6 }
        display={{ base: pagination?.isVisible ? 'flex' : 'none', lg: 'flex' }}
        justifyContent="end"
        gap={ 6 }
      >
        { isAdvancedFilterEnabled && <AdvancedFilterLink/> }
        { pagination?.isVisible && <Pagination { ...pagination }/> }
      </ActionBar>
    );
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'cctx',
      title: 'Cross chain',
      component: (
        <SocketProvider url={ config.apis.zetachain?.socketEndpoint } name="zetachain">
          <ZetaChainCCTXsTab/>
        </SocketProvider>
      ),
      subTabs: CROSS_CHAIN_TABS,
    },
    {
      id: 'zetachain',
      title: 'ZetaChain EVM',
      component: <ZetaChainEvmTransactions/>,
      subTabs: ZETACHAIN_TABS,
    },
    config.features.dataAvailability.isEnabled && {
      id: 'blob_txs',
      title: 'Blob txns',
      component: (
        <>
          <TxsStats/>
          { topRow }
          <TxsWithFrontendSorting query={ txsWithBlobsQuery }/>
        </>
      ),
    },
    isAuth ? {
      id: 'watchlist',
      title: 'Watch list',
      component: (
        <>
          <TxsStats/>
          { topRow }
          <TxsWatchlist query={ txsWatchlistQuery }/>
        </>
      ),
    } : undefined,
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } transactions` : 'Transactions' }
        withTextAd
      />
      <RoutedTabs tabs={ tabs } defaultTabId="zetachain"/>
    </>
  );
};

export default TransactionsZetaChain;
