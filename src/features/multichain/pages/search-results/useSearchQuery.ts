// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiInfiniteQuery from 'src/api/hooks/useApiInfiniteQuery';
import useApiQuery from 'src/api/hooks/useApiQuery';

import { useDebouncedFilterChange } from 'src/shared/pagination/useDebouncedFilterChange';
import getQueryParamString from 'src/shared/router/get-query-param-string';

interface Props {
  chainId: string | undefined;
}

export default function useSearchQuery({ chainId }: Props) {
  const router = useRouter();
  const q = React.useRef(getQueryParamString(router.query.q));
  const initialValue = q.current;
  const checkRedirect = getQueryParamString(router.query.redirect) === 'true';

  const appliedSearchTerm = getQueryParamString(router.query.q);
  const [ searchTerm, setSearchTerm ] = React.useState(appliedSearchTerm);

  const checkRedirectQuery = useApiQuery('multichainAggregator:search_check_redirect', {
    // on search result page we check redirect only once on mount
    queryParams: { q: initialValue },
    queryOptions: { enabled: Boolean(initialValue) && checkRedirect },
  });

  const addressesQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_addresses',
    queryParams: { q: appliedSearchTerm, chain_id: chainId },
  });

  const tokensQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_tokens',
    queryParams: { q: appliedSearchTerm, chain_id: chainId },
  });

  const blockNumbersQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_block_numbers',
    queryParams: { q: appliedSearchTerm, chain_id: chainId },
  });

  const blocksQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_blocks',
    queryParams: { q: appliedSearchTerm, chain_id: chainId },
  });

  const nftsQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_nfts',
    queryParams: { q: appliedSearchTerm, chain_id: chainId },
  });

  const transactionsQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_transactions',
    queryParams: { q: appliedSearchTerm, chain_id: chainId },
  });

  const domainsQuery = useApiInfiniteQuery({
    resourceName: 'multichainAggregator:search_domains',
    queryParams: { q: appliedSearchTerm, chain_id: chainId },
  });

  const applySearchTerm = useDebouncedFilterChange((value) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, q: value },
    }, undefined, { shallow: true });
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    setSearchTerm(value);
    applySearchTerm(value);
  }, [ applySearchTerm ]);

  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, [ ]);

  const queries = React.useMemo(() => ({
    addresses: addressesQuery,
    tokens: tokensQuery,
    blockNumbers: blockNumbersQuery,
    blocks: blocksQuery,
    nfts: nftsQuery,
    transactions: transactionsQuery,
    domains: domainsQuery,
  }), [ addressesQuery, tokensQuery, blockNumbersQuery, blocksQuery, nftsQuery, transactionsQuery, domainsQuery ]);

  return React.useMemo(() => ({
    searchTerm,
    appliedSearchTerm,
    handleSearchTermChange,
    handleSubmit,
    queries,
    checkRedirectQuery,
  }), [
    queries,
    appliedSearchTerm,
    handleSearchTermChange,
    handleSubmit,
    searchTerm,
    checkRedirectQuery,
  ]);
}
