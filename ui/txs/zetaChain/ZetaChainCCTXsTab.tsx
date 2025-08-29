import { capitalize, omit } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import { ADVANCED_FILTER_AGES, type AdvancedFilterAge } from 'types/api/advancedFilter';
import { ZETA_CHAIN_CCTX_STATUS_REDUCED_FILTERS, type ZetaChainCCTXFilterParams, type ZetaChainCCTXStatusReducedFilter } from 'types/api/zetaChain';

import dayjs from 'lib/date/dayjs';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getValuesArrayFromQuery from 'lib/getValuesArrayFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import { zetaChainCCTXItem } from 'mocks/zetaChain/zetaChainCCTX';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import { getDurationFromAge } from 'ui/advancedFilter/lib';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import ZetaChainFilterTags from './filters/ZetaChainFilterTags';
import ZetaChainCCTxs from './ZetaChainCCTxs';
import ZetaChainCCTXsStats from './ZetaChainCCTXsStats';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 3,
  pb: 3,
  marginTop: -2,
};
const TABS_HEIGHT = 64;

const ZetaChainEvmTransactions = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const [ filters, setFilters ] = React.useState<ZetaChainCCTXFilterParams>(() => {
    const age = getFilterValueFromQuery<AdvancedFilterAge>(ADVANCED_FILTER_AGES, router.query.age);
    const startTimestampFromQuery = getQueryParamString(router.query.start_timestamp) ? getQueryParamString(router.query.start_timestamp) : undefined;
    const endTimestampFromQuery = getQueryParamString(router.query.end_timestamp) ? getQueryParamString(router.query.end_timestamp) : undefined;
    return {
      end_timestamp: age ? dayjs().unix().toString() : endTimestampFromQuery,
      start_timestamp: age ? dayjs((dayjs().valueOf() - getDurationFromAge(age))).unix().toString() : startTimestampFromQuery,
      age,
      status_reduced: getFilterValueFromQuery<ZetaChainCCTXStatusReducedFilter>(ZETA_CHAIN_CCTX_STATUS_REDUCED_FILTERS, router.query.status_reduced),
      sender_address: getValuesArrayFromQuery(router.query.sender_address),
      receiver_address: getValuesArrayFromQuery(router.query.receiver_address),
      source_chain_id: getValuesArrayFromQuery(router.query.source_chain_id),
      target_chain_id: getValuesArrayFromQuery(router.query.target_chain_id),
      token_symbol: getValuesArrayFromQuery(router.query.token_symbol),
    };
  });

  const cctxsValidatedQuery = useQueryWithPages({
    resourceName: 'zetachain:transactions',
    queryParams: {
      ...filters,
      limit: 50,
      offset: 0,
      status_reduced: filters.status_reduced ?? [ 'Success', 'Failed' ],
      direction: 'DESC',
    },
    options: {
      placeholderData: { items: Array(50).fill(zetaChainCCTXItem), next_page_params: { page_index: 0, offset: 0, direction: 'DESC' } },
      enabled: tab === 'cctx' || tab === 'cctx_mined',
    },
  });

  const cctxsPendingQuery = useQueryWithPages({
    resourceName: 'zetachain:transactions',
    queryParams: {
      ...filters,
      limit: 50,
      offset: 0,
      status_reduced: filters.status_reduced ?? [ 'Pending' ],
      direction: 'DESC',
    },
    options: {
      placeholderData: { items: Array(50).fill(zetaChainCCTXItem), next_page_params: { page_index: 0, offset: 0, direction: 'DESC' } },
      enabled: tab === 'cctx_pending',
    },
  });

  const query = tab === 'cctx_mined' ? cctxsValidatedQuery : cctxsPendingQuery;

  const handleFilterChange = React.useCallback(<T extends keyof ZetaChainCCTXFilterParams>(field: T, val: ZetaChainCCTXFilterParams[T]) => {
    setFilters(prevState => {
      const newState = { ...prevState };
      newState[field] = val;
      query.onFilterChange(newState.age ? omit(newState, [ 'start_timestamp', 'end_timestamp' ]) : newState);

      return newState;
    });
  }, [ query ]);

  const onClearFilter = React.useCallback((key: keyof ZetaChainCCTXFilterParams) => () => {
    if (key === 'age') {
      handleFilterChange('start_timestamp', undefined);
      handleFilterChange('end_timestamp', undefined);
    }
    handleFilterChange(key, undefined);
  },
  [ handleFilterChange ],
  );

  const clearAllFilters = React.useCallback(() => {
    setFilters({});
    query.onFilterChange({});
  }, [ query ]);

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
      case 'cctx_pending': return cctxsPendingQuery.pagination;
      default: return cctxsValidatedQuery.pagination;
    }
  })();

  return (
    <>
      <ZetaChainCCTXsStats/>
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
