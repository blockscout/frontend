// SPDX-License-Identifier: LicenseRef-Blockscout

import { capitalize, omit } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import React from 'react';

import { Direction } from '@blockscout/zetachain-cctx-types';
import { ADVANCED_FILTER_AGES, type AdvancedFilterAge } from 'src/features/advanced-filter/types/api';
import { ZETA_CHAIN_CCTX_COIN_TYPE_FILTER, ZETA_CHAIN_CCTX_STATUS_REDUCED_FILTERS } from 'src/features/chain-variants/zeta-chain/types/client';
import type { CoinTypeFilter, StatusReducedFilters, ZetaChainCCTXFilterParams } from 'src/features/chain-variants/zeta-chain/types/client';
import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import getChainValidationActionText from 'src/slices/chain/verification-type/utils/get-chain-validation-action-text';

import { getDurationFromAge } from 'src/features/advanced-filter/utils/lib';
import { ZETA_CHAIN_CCTX_LIST_ITEM } from 'src/features/chain-variants/zeta-chain/stubs';

import dayjs from 'src/shared/date-and-time/dayjs';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import { usePaginationParams } from 'src/shared/pagination/usePaginationParams';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import getFilterValueFromQuery from 'src/shared/router/get-filter-value-from-query';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getValuesArrayFromQuery from 'src/shared/router/get-values-array-from-query';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import ZetaChainCCTxs from './ZetaChainCCTxs';
import ZetaChainCCTXsStats from './ZetaChainCCTXsStats';
import ZetaChainFilterTags from './ZetaChainFilterTags';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 3,
  pb: 3,
  marginTop: -2,
};
const TABS_HEIGHT = 64;

const RESOURCE_NAME = 'zetachain:transactions';

const hasNextPageFn = (nextPageParams: Record<string, unknown>) => {
  return nextPageParams.limit !== '0';
};

// The URL carries an age preset without its range; the range is recomputed from "now" whenever the filters change.
function getFiltersFromQuery(query: ZetaChainCCTXFilterParams): ZetaChainCCTXFilterParams {
  const age = getFilterValueFromQuery<AdvancedFilterAge>(ADVANCED_FILTER_AGES, query.age);

  return {
    end_timestamp: age ? dayjs().unix().toString() : getQueryParamString(query.end_timestamp) || undefined,
    start_timestamp: age ? dayjs(dayjs().valueOf() - getDurationFromAge(age)).unix().toString() : getQueryParamString(query.start_timestamp) || undefined,
    age,
    status_reduced: getFilterValueFromQuery<StatusReducedFilters>(ZETA_CHAIN_CCTX_STATUS_REDUCED_FILTERS, query.status_reduced),
    sender_address: getValuesArrayFromQuery(query.sender_address),
    receiver_address: getValuesArrayFromQuery(query.receiver_address),
    source_chain_id: getValuesArrayFromQuery(query.source_chain_id),
    target_chain_id: getValuesArrayFromQuery(query.target_chain_id),
    token_symbol: getValuesArrayFromQuery(query.token_symbol),
    coin_type: getFilterValueFromQuery<CoinTypeFilter>([ ZETA_CHAIN_CCTX_COIN_TYPE_FILTER ], query.coin_type),
  };
}

const ZetaChainCCTXsTab = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const { filters: filtersFromUrl } = usePaginationParams(RESOURCE_NAME);
  const filters = React.useMemo(() => getFiltersFromQuery(filtersFromUrl), [ filtersFromUrl ]);

  const cctxsValidatedQuery = useQueryWithPages({
    resourceName: RESOURCE_NAME,
    queryParams: {
      ...filters,
      limit: 50,
      offset: 0,
      status_reduced: filters.status_reduced ?? [ 'Success', 'Failed' ],
      direction: 'DESC',
    },
    options: {
      placeholderData: { items: Array(50).fill(ZETA_CHAIN_CCTX_LIST_ITEM), next_page_params: { limit: 0, page_key: 0, direction: Direction.DESC } },
      enabled: tab === 'cctx' || tab === 'cctx_mined',
    },
    hasNextPageFn,
  });

  const cctxsPendingQuery = useQueryWithPages({
    resourceName: RESOURCE_NAME,
    queryParams: {
      ...filters,
      limit: 50,
      offset: 0,
      status_reduced: filters.status_reduced ?? [ 'Pending' ],
      direction: 'DESC',
    },
    options: {
      placeholderData: { items: Array(50).fill(ZETA_CHAIN_CCTX_LIST_ITEM), next_page_params: { limit: 0, page_key: 0, direction: Direction.DESC } },
      enabled: tab === 'cctx_pending',
    },
    hasNextPageFn,
  });

  const query = tab === 'cctx_mined' ? cctxsValidatedQuery : cctxsPendingQuery;
  const { onFilterChange } = query;

  const latestFilters = React.useRef(filters);
  latestFilters.current = filters;
  const pendingFilters = React.useRef<ZetaChainCCTXFilterParams | null>(null);

  // The column filters report one field per call and several per user action (an age preset sets its range
  // and the preset, the asset filter sets the coin type and the symbol). The calls of one tick are collected
  // and pushed to the URL together, so one action is one navigation and one request.
  const handleFilterChange = React.useCallback(<T extends keyof ZetaChainCCTXFilterParams>(field: T, val: ZetaChainCCTXFilterParams[T]) => {
    if (pendingFilters.current === null) {
      pendingFilters.current = { ...latestFilters.current };
      queueMicrotask(() => {
        const nextFilters = pendingFilters.current ?? {};
        pendingFilters.current = null;
        onFilterChange(nextFilters.age ? omit(nextFilters, [ 'start_timestamp', 'end_timestamp' ]) : nextFilters);
      });
    }
    pendingFilters.current[field] = val;
  }, [ onFilterChange ]);

  const onClearFilter = React.useCallback((key: keyof ZetaChainCCTXFilterParams) => () => {
    if (key === 'age') {
      handleFilterChange('start_timestamp', undefined);
      handleFilterChange('end_timestamp', undefined);
    }
    if (key === 'token_symbol') {
      handleFilterChange('coin_type', undefined);
    }
    handleFilterChange(key, undefined);
  },
  [ handleFilterChange ],
  );

  const clearAllFilters = React.useCallback(() => {
    onFilterChange({});
  }, [ onFilterChange ]);

  const verifiedTitle = capitalize(getChainValidationActionText());

  const tabs: Array<TabItemRegular> = [
    {
      id: 'cctx_mined',
      title: verifiedTitle,
      component:
        <ZetaChainCCTxs
          pagination={ cctxsValidatedQuery.pagination }
          items={ cctxsValidatedQuery.data?.items }
          isInitialLoading={ cctxsValidatedQuery.isInitialLoading }
          isTransitioning={ cctxsValidatedQuery.isTransitioning }
          isError={ cctxsValidatedQuery.isError }
          top={ cctxsValidatedQuery.pagination.isVisible ? TABS_HEIGHT : 0 }
          filters={ filters }
          onFilterChange={ handleFilterChange }
          showStatusFilter={ true }
          type="mined"
          resetKey={ cctxsValidatedQuery.queryHash }
        /> },
    {
      id: 'cctx_pending',
      title: 'Pending',
      component: (
        <ZetaChainCCTxs
          pagination={ cctxsPendingQuery.pagination }
          items={ cctxsPendingQuery.data?.items }
          isInitialLoading={ cctxsPendingQuery.isInitialLoading }
          isTransitioning={ cctxsPendingQuery.isTransitioning }
          isError={ cctxsPendingQuery.isError }
          top={ cctxsPendingQuery.pagination.isVisible ? TABS_HEIGHT : 0 }
          filters={ filters }
          onFilterChange={ handleFilterChange }
          showStatusFilter={ false }
          type="pending"
          resetKey={ cctxsPendingQuery.queryHash }
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

export default ZetaChainCCTXsTab;
