import { useRouter } from 'next/router';
import React from 'react';

import useDebounce from 'lib/hooks/useDebounce';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import useUpdateValueEffect from 'lib/hooks/useUpdateValueEffect';

export default function useSearchQuery(isSearchPage = false) {
  const router = useRouter();
  const initialValue = isSearchPage ? String(router.query.q || '') : '';

  const [ searchTerm, setSearchTerm ] = React.useState(initialValue);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const query = useQueryWithPages({
    resourceName: 'search',
    filters: { q: debouncedSearchTerm },
    options: { enabled: debouncedSearchTerm.trim().length > 0 },
  });

  useUpdateValueEffect(() => {
    if (isSearchPage) {
      query.onFilterChange({ q: debouncedSearchTerm });
    }
  }, debouncedSearchTerm);

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
  };
}
