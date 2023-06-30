import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';
import useUpdateValueEffect from 'lib/hooks/useUpdateValueEffect';
import getQueryParamString from 'lib/router/getQueryParamString';
import { SEARCH_RESULT_ITEM, SEARCH_RESULT_NEXT_PAGE_PARAMS } from 'stubs/search';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

export default function useSearchQuery(isSearchPage = false) {
  const router = useRouter();
  const q = React.useRef(getQueryParamString(router.query.q));
  const initialValue = isSearchPage ? q.current : '';

  const [ searchTerm, setSearchTerm ] = React.useState(initialValue);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pathname = router.pathname;

  const query = useQueryWithPages({
    resourceName: 'search',
    filters: { q: debouncedSearchTerm },
    options: {
      enabled: debouncedSearchTerm.trim().length > 0,
      placeholderData: isSearchPage ?
        generateListStub<'search'>(SEARCH_RESULT_ITEM, 50, { next_page_params: SEARCH_RESULT_NEXT_PAGE_PARAMS }) :
        undefined,
    },
  });

  const redirectCheckQuery = useApiQuery('search_check_redirect', {
    // on search result page we check redirect only once on mount
    // on pages with regular search bar we check redirect on every search term change
    // in order to prepend its result to suggest list since this resource is much faster than regular search
    queryParams: { q: isSearchPage ? q.current : debouncedSearchTerm },
    queryOptions: { enabled: Boolean(isSearchPage ? q.current : debouncedSearchTerm) },
  });

  useUpdateValueEffect(() => {
    if (isSearchPage) {
      query.onFilterChange({ q: debouncedSearchTerm });
    }
  }, debouncedSearchTerm);

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
    redirectCheckQuery,
    pathname,
  }), [ debouncedSearchTerm, pathname, query, redirectCheckQuery, searchTerm ]);
}
