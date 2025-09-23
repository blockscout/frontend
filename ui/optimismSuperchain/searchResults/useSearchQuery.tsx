import { useRouter } from 'next/router';
import React from 'react';

import useApiInfiniteQuery from 'lib/api/useApiInfiniteQuery';
import useDebounce from 'lib/hooks/useDebounce';
import getQueryParamString from 'lib/router/getQueryParamString';

export default function useSearchQuery() {
  const router = useRouter();
  const q = React.useRef(getQueryParamString(router.query.q));
  const initialValue = q.current;

  const [ searchTerm, setSearchTerm ] = React.useState(initialValue);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const addressesQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_addresses',
    queryParams: { q: debouncedSearchTerm },
  });

  const tokensQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_tokens',
    queryParams: { q: debouncedSearchTerm },
  });

  const blocksNumbersQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_block_numbers',
    queryParams: { q: debouncedSearchTerm },
  });

  const blocksQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_blocks',
    queryParams: { q: debouncedSearchTerm },
  });

  const nftsQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_nfts',
    queryParams: { q: debouncedSearchTerm },
  });

  const transactionsQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_transactions',
    queryParams: { q: debouncedSearchTerm },
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, [ setSearchTerm ]);

  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, [ ]);

  const queries = React.useMemo(() => ({
    addresses: addressesQuery,
    tokens: tokensQuery,
    blocksNumbers: blocksNumbersQuery,
    blocks: blocksQuery,
    nfts: nftsQuery,
    transactions: transactionsQuery,
  }), [ addressesQuery, tokensQuery, blocksNumbersQuery, blocksQuery, nftsQuery, transactionsQuery ]);

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange,
    handleSubmit,
    queries,
  }), [
    queries,
    debouncedSearchTerm,
    handleSearchTermChange,
    handleSubmit,
    searchTerm,
  ]);
}
