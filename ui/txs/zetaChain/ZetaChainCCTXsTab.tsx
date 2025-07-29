import { capitalize } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import { zetaChainCCTX } from 'mocks/zetaChain/zetaChainCCTX';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxsStats from 'ui/txs/TxsStats';

import ZetaChainCCTxs from './ZetaChainCCTxs';

const TABS_HEIGHT = 88;

const ZetaChainEvmTransactions = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const cctxsValidatedQuery = useQueryWithPages({
    resourceName: 'zetachain:transactions',
    queryParams: {
      limit: 50,
      offset: 0,
      status_reduced: [ 'Success', 'Failed' ],
      direction: 'DESC',
    },
    options: {
      placeholderData: { items: Array(50).fill(zetaChainCCTX), next_page_params: { page_index: 0, offset: 0, direction: 'DESC' } },
      enabled: !tab || tab === 'cross_chain' || tab === 'cctx_validated',
    },
  });

  const cctxsPendingQuery = useQueryWithPages({
    resourceName: 'zetachain:transactions',
    queryParams: {
      limit: 50,
      offset: 0,
      status_reduced: 'Pending',
      direction: 'DESC',
    },
    options: {
      placeholderData: { items: Array(50).fill(zetaChainCCTX), next_page_params: { page_index: 0, offset: 0, direction: 'DESC' } },
      enabled: tab === 'cctx_pending',
    },
  });

  const verifiedTitle = capitalize(getNetworkValidationActionText());

  const tabs: Array<TabItemRegular> = [
    {
      id: 'cctx_validated',
      title: verifiedTitle,
      component:
        <ZetaChainCCTxs
          pagination={ cctxsValidatedQuery.pagination }
          items={ cctxsValidatedQuery.data?.items }
          isPlaceholderData={ cctxsValidatedQuery.isPlaceholderData }
          isError={ cctxsValidatedQuery.isError }
          top={ TABS_HEIGHT }
        /> },
    {
      id: 'cctx_pending',
      title: 'Pending',
      component: (
        <ZetaChainCCTxs
          pagination={ cctxsValidatedQuery.pagination }
          items={ cctxsPendingQuery.data?.items }
          isPlaceholderData={ cctxsPendingQuery.isPlaceholderData }
          isError={ cctxsPendingQuery.isError }
          top={ TABS_HEIGHT }
        />
      ),
    },
  ];

  const pagination = (() => {
    switch (tab) {
      case 'zetachain_pending': return cctxsPendingQuery.pagination;
      default: return cctxsValidatedQuery.pagination;
    }
  })();

  return (
    <>
      <TxsStats/>
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        rightSlot={ (isMobile || !pagination.isVisible) ? null : <Pagination my={ 1 } { ...pagination }/> }
      />
    </>
  );
};

export default ZetaChainEvmTransactions;
