import { useQuery } from '@tanstack/react-query';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { SearchResult } from 'types/api/search';

import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import { getResourceKey } from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';

const data = [
  {
    address: '0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
    address_url: '/address/0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
    name: 'Toms NFT',
    symbol: 'TNT',
    token_url: '/token/0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
    type: 'token' as const,
  },
  {
    address: '0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    address_url: '/address/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    name: 'TomToken',
    symbol: 'pdE1B',
    token_url: '/token/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    type: 'token' as const,
  },
  {
    address: '0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    address_url: '/address/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    name: 'TomToken',
    symbol: 'pdE1B',
    token_url: '/token/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    type: 'token' as const,
  },
  {
    block_hash: '0x1af31d7535dded06bab9a88eb40ee2f8d0529a60ab3b8a7be2ba69b008cacbd1',
    block_number: 8198536,
    type: 'block' as const,
    url: '/block/0x1af31d7535dded06bab9a88eb40ee2f8d0529a60ab3b8a7be2ba69b008cacbd1',
  },
  {
    address: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
    name: null,
    type: 'address' as const,
    url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  },
  {
    tx_hash: '0x349d4025d03c6faec117ee10ac0bce7c7a805dd2cbff7a9f101304d9a8a525dd',
    type: 'transaction' as const,
    url: '/tx/0x349d4025d03c6faec117ee10ac0bce7c7a805dd2cbff7a9f101304d9a8a525dd',
  },
];

export default function useSearchQuery() {
  const [ searchTerm, setSearchTerm ] = React.useState('');
  const abortControllerRef = React.useRef<AbortController>();
  const apiFetch = useApiFetch();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const query = useQuery<unknown, ResourceError, SearchResult>(
    getResourceKey('search', { queryParams: { q: debouncedSearchTerm } }),
    () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      return apiFetch<'search', SearchResult>('search', {
        queryParams: { q: debouncedSearchTerm },
        fetchParams: { signal: abortControllerRef.current.signal },
      });
    },
    {
      enabled: debouncedSearchTerm.trim().length > 0,
      initialData: {
        items: data,
      },
    },
  );

  const handleSearchTermChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  return {
    searchTerm,
    handleSearchTermChange,
    query,
  };
}
