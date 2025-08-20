import { capitalize } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { ZetaChainCCTXFilterParams } from 'types/api/zetaChain';

import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import { zetaChainCCTXItem } from 'mocks/zetaChain/zetaChainCCTX';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import ZetaChainFilterTags from './filters/ZetaChainFilterTags';
import ZetaChainCCTxs from './ZetaChainCCTxs';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
};
const TABS_HEIGHT = 88;

const ZetaChainEvmTransactions = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const [ filters, setFilters ] = React.useState<ZetaChainCCTXFilterParams>({});

  const handleFilterChange = React.useCallback(<T extends keyof ZetaChainCCTXFilterParams>(field: T, val: ZetaChainCCTXFilterParams[T]) => {
    setFilters(prevState => {
      const newState = { ...prevState };
      newState[field] = val;
      return newState;
    });
  }, []);

  const onClearFilter = React.useCallback((key: keyof ZetaChainCCTXFilterParams) => () => {
    setFilters(prevState => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
  }, []);

  const clearAllFilters = React.useCallback(() => {
    setFilters({});
  }, []);

  const cctxsValidatedQuery = useQueryWithPages({
    resourceName: 'zetachain:transactions',
    queryParams: {
      limit: 50,
      offset: 0,
      status_reduced: [ 'Success', 'Failed' ],
      direction: 'DESC',
      ...filters,
    },
    options: {
      placeholderData: { items: Array(50).fill(zetaChainCCTXItem), next_page_params: { page_index: 0, offset: 0, direction: 'DESC' } },
      enabled: !tab || tab === 'cctx' || tab === 'cctx_mined',
    },
  });

  const cctxsPendingQuery = useQueryWithPages({
    resourceName: 'zetachain:transactions',
    queryParams: {
      limit: 50,
      offset: 0,
      status_reduced: 'Pending',
      direction: 'DESC',
      ...filters,
    },
    options: {
      placeholderData: { items: Array(50).fill(zetaChainCCTXItem), next_page_params: { page_index: 0, offset: 0, direction: 'DESC' } },
      enabled: tab === 'cctx_pending',
    },
  });

  const verifiedTitle = capitalize(getNetworkValidationActionText());

  const tabs: Array<TabItemRegular> = [
    {
      id: 'cctx_mined',
      title: verifiedTitle,
      component:
        <ZetaChainCCTxs
          pagination={ cctxsValidatedQuery.pagination }
          items={ cctxsValidatedQuery.data?.items }
          isPlaceholderData={ cctxsValidatedQuery.isPlaceholderData }
          isError={ cctxsValidatedQuery.isError }
          top={ cctxsValidatedQuery.pagination.isVisible ? TABS_HEIGHT : 0 }
          filters={ filters }
          onFilterChange={ handleFilterChange }
          showStatusFilter={ true }
          type="mined"
        /> },
    {
      id: 'cctx_pending',
      title: 'Pending',
      component: (
        <ZetaChainCCTxs
          pagination={ cctxsPendingQuery.pagination }
          items={ cctxsPendingQuery.data?.items }
          isPlaceholderData={ cctxsPendingQuery.isPlaceholderData }
          isError={ cctxsPendingQuery.isError }
          top={ cctxsPendingQuery.pagination.isVisible ? TABS_HEIGHT : 0 }
          filters={ filters }
          onFilterChange={ handleFilterChange }
          showStatusFilter={ false }
          type="pending"
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
      { /* <TxsStats/> */ }
      <ZetaChainFilterTags
        filters={ filters }
        onClearFilter={ onClearFilter }
        onClearAll={ clearAllFilters }
      />
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        stickyEnabled={ !isMobile }
        rightSlot={ (isMobile || !pagination.isVisible) ? null : <Pagination my={ 1 } { ...pagination }/> }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
      />
    </>
  );
};

export default ZetaChainEvmTransactions;
