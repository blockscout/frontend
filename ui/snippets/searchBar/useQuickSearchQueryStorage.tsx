import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';

export default function useQuickSearchQuery() {
  const router = useRouter();

  const [ searchTerm, setSearchTerm ] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pathname = router.pathname;

  const query = useApiQuery('quick_search', {
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { enabled: debouncedSearchTerm.trim().length > 0 },
  });

  const redirectCheckQuery = useApiQuery('search_check_redirect', {
    // on pages with regular search bar we check redirect on every search term change
    // in order to prepend its result to suggest list since this resource is much faster than regular search
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { enabled: Boolean(debouncedSearchTerm) },
  });

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
    redirectCheckQuery,
    pathname,
  }), [ debouncedSearchTerm, pathname, query, redirectCheckQuery, searchTerm ]);
}
