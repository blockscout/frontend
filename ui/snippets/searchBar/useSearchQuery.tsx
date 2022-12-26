import type { ChangeEvent } from 'react';
import React from 'react';

import type { SearchResult } from 'types/api/search';

import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useDebouncedQuery from 'lib/hooks/useDebouncedQuery';

export default function useSearchQuery() {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const searchTermRef = React.useRef('');
  const abortControllerRef = React.useRef<AbortController>();
  const apiFetch = useApiFetch();

  const query = useDebouncedQuery<SearchResult, ResourceError>(
    [ 'search', searchTerm ],
    () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      return apiFetch<'search', SearchResult>('search', {
        queryParams: { q: searchTermRef.current },
        fetchParams: { signal: abortControllerRef.current.signal },
      });
    },
    300,
    { enabled: searchTerm.trim().length > 0 },
  );

  const handleSearchTermChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    searchTermRef.current = value;
  }, []);

  return {
    searchTerm,
    handleSearchTermChange,
    query,
  };
}
