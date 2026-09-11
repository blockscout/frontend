// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { fromBech32Address, isBech32Address } from 'src/slices/address/utils/bech32';
import { SEARCH_RESULT_ITEM } from 'src/slices/search/stubs';

import { getExternalSearchItem } from 'src/features/chain-variants/zeta-chain/utils/external-search';

import config from 'src/config';
import { useDebouncedFilterChange } from 'src/shared/pagination/useDebouncedFilterChange';
import { usePaginationParams } from 'src/shared/pagination/usePaginationParams';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

export default function useSearchQuery(withRedirectCheck?: boolean) {
  const router = useRouter();
  const q = React.useRef(getQueryParamString(router.query.q));
  const pathname = router.pathname;

  const appliedSearchTerm = getQueryParamString(usePaginationParams('core:search').filters.q);
  const [ searchTerm, setSearchTerm ] = React.useState(appliedSearchTerm);

  const query = useQueryWithPages({
    resourceName: 'core:search',
    queryParams: isBech32Address(appliedSearchTerm) ? { q: fromBech32Address(appliedSearchTerm) } : undefined,
    options: {
      enabled: appliedSearchTerm.trim().length > 0,
      placeholderData: generateListStub<'core:search'>(SEARCH_RESULT_ITEM, 50, { next_page_params: {} }),
    },
  });

  const redirectCheckQuery = useApiQuery('core:search_check_redirect', {
    // on search result page we check redirect only once on mount
    queryParams: { q: q.current },
    queryOptions: { enabled: Boolean(q.current) && withRedirectCheck },
  });

  const zetaChainCCTXQuery = useApiQuery('zetachain:transactions', {
    queryParams: {
      hash: appliedSearchTerm,
      limit: 50,
      offset: 0,
      direction: 'DESC',
    },
    queryOptions: { enabled: config.features.zetachain.isEnabled && appliedSearchTerm.trim().length > 0 },
  });

  const { onFilterChange } = query;
  const applySearchTerm = useDebouncedFilterChange((value) => onFilterChange({ q: value }));

  const handleSearchTermChange = React.useCallback((value: string) => {
    setSearchTerm(value);
    applySearchTerm(value);
  }, [ applySearchTerm ]);

  return React.useMemo(() => ({
    searchTerm,
    appliedSearchTerm,
    handleSearchTermChange,
    query,
    redirectCheckQuery,
    pathname,
    zetaChainCCTXQuery,
    externalSearchItem: getExternalSearchItem(appliedSearchTerm),
  }), [ appliedSearchTerm, pathname, query, redirectCheckQuery, searchTerm, zetaChainCCTXQuery, handleSearchTermChange ]);
}
