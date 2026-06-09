// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { fromBech32Address, isBech32Address } from 'src/slices/address/utils/bech32';
import { SEARCH_RESULT_ITEM, SEARCH_RESULT_NEXT_PAGE_PARAMS } from 'src/slices/search/stubs';

import { getExternalSearchItem } from 'src/features/chain-variants/zeta-chain/utils/external-search';

import config from 'src/config';
import useDebounce from 'src/shared/hooks/useDebounce';
import useUpdateValueEffect from 'src/shared/hooks/useUpdateValueEffect';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

export default function useSearchQuery(withRedirectCheck?: boolean) {
  const router = useRouter();
  const q = React.useRef(getQueryParamString(router.query.q));
  const initialValue = q.current;

  const [ searchTerm, setSearchTerm ] = React.useState(initialValue);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pathname = router.pathname;

  const query = useQueryWithPages({
    resourceName: 'core:search',
    filters: { q: isBech32Address(debouncedSearchTerm) ? fromBech32Address(debouncedSearchTerm) : debouncedSearchTerm },
    options: {
      enabled: debouncedSearchTerm.trim().length > 0,
      placeholderData: generateListStub<'core:search'>(SEARCH_RESULT_ITEM, 50, { next_page_params: SEARCH_RESULT_NEXT_PAGE_PARAMS }),
    },
  });

  const redirectCheckQuery = useApiQuery('core:search_check_redirect', {
    // on search result page we check redirect only once on mount
    queryParams: { q: q.current },
    queryOptions: { enabled: Boolean(q.current) && withRedirectCheck },
  });

  const zetaChainCCTXQuery = useApiQuery('zetachain:transactions', {
    queryParams: {
      hash: debouncedSearchTerm,
      limit: 50,
      offset: 0,
      direction: 'DESC',
    },
    queryOptions: { enabled: config.features.zetachain.isEnabled && debouncedSearchTerm.trim().length > 0 },
  });

  useUpdateValueEffect(() => {
    query.onFilterChange({ q: debouncedSearchTerm });
  }, debouncedSearchTerm);

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
    redirectCheckQuery,
    pathname,
    zetaChainCCTXQuery,
    externalSearchItem: getExternalSearchItem(debouncedSearchTerm),
  }), [ debouncedSearchTerm, pathname, query, redirectCheckQuery, searchTerm, zetaChainCCTXQuery ]);
}
