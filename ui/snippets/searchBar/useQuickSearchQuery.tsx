import BigNumber from 'bignumber.js';
import { isAddress, isHexString } from 'ethers';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { SearchResultItem } from 'types/api/search';

import useApiQuery from 'lib/api/useApiQuery';
import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import useDebounce from 'lib/hooks/useDebounce';
import { isNumberOnly } from 'ui/storage/utils';

export interface QueryResult {
  data: Array<any>;
  isError: boolean;
  isPending: boolean;
}

export default function useQuickSearchQuery() {
  const router = useRouter();

  const [ searchTerm, setSearchTerm ] = React.useState('');
  // For show more filter
  const [ type, setType ] = React.useState('default');
  const graphqlSearchOnly = React.useRef(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const pathname = router.pathname;

  useEffect(() => {

  }, [ debouncedSearchTerm ]);

  React.useEffect(() => {
    setType('default');
  }, [ debouncedSearchTerm ]);

  const graphqlQuerires = React.useCallback(() => {
    if (!debouncedSearchTerm ||
      isAddress(debouncedSearchTerm) ||
      isHexString(debouncedSearchTerm, 66)) {
      return [];
    }

    if (isNumberOnly(debouncedSearchTerm) && new BigNumber(debouncedSearchTerm).gte(new BigNumber('9223372036854775807'))) {
      graphqlSearchOnly.current = true;
    } else {
      graphqlSearchOnly.current = false;
    }

    return [
      {
        tableName: 'objects',
        fields: [
          'object_id',
          'object_name',
          'owner_address',
        ],
        limit: 6,
        offset: 0,
        where: {
          _or: [
            { object_name: { _ilike: `${ debouncedSearchTerm }%` } },
            { object_id: { _eq: debouncedSearchTerm } },
          ],
        },
        order: { update_time: 'desc' },
      },
      {
        tableName: 'buckets',
        fields: [
          'bucket_id',
          'bucket_name',
          'owner_address',
        ],
        limit: 6,
        offset: 0,
        where: {
          _or: [
            { bucket_name: { _ilike: `${ debouncedSearchTerm }%` } },
            { bucket_id: { _eq: debouncedSearchTerm } },
          ],
        },
        order: { update_time: 'desc' },
      },
      {
        tableName: 'groups',
        fields: [
          'group_id',
          'group_name',
          'owner_address',
        ],
        limit: 6,
        offset: 0,
        where: {
          _or: [
            { group_name: { _ilike: `${ debouncedSearchTerm }%` } },
            { group_id: { _eq: debouncedSearchTerm } },
          ],
        },
        order: { update_time: 'desc' },
      },
    ];
  }, [ debouncedSearchTerm ]);

  const graphqlShowMoreQueries = React.useCallback(() => {
    switch (type) {
      case 'objects':
        // graphqlSearchOnly.current = true;
        return [
          {
            tableName: 'objects',
            fields: [
              'object_id',
              'object_name',
              'owner_address',
            ],
            limit: 50,
            offset: 0,
            where: {
              _or: [
                { object_name: { _ilike: `${ debouncedSearchTerm }%` } },
                { object_id: { _eq: debouncedSearchTerm } },
              ],
            },
            order: { update_time: 'desc' },
          },
        ];
      case 'buckets':
        // graphqlSearchOnly.current = true;
        return [
          {
            tableName: 'buckets',
            fields: [
              'bucket_id',
              'bucket_name',
              'owner_address',
            ],
            limit: 50,
            offset: 0,
            where: {
              _or: [
                { bucket_name: { _ilike: `${ debouncedSearchTerm }%` } },
                { bucket_id: { _eq: debouncedSearchTerm } },
              ],
            },
            order: { update_time: 'desc' },
          },
        ];
      case 'groups':
        // graphqlSearchOnly.current = true;
        return [
          {
            tableName: 'groups',
            fields: [
              'group_id',
              'group_name',
              'owner_address',
            ],
            limit: 50,
            offset: 0,
            where: {
              _or: [
                { group_name: { _ilike: `${ debouncedSearchTerm }%` } },
                { group_id: { _eq: debouncedSearchTerm } },
              ],
            },
            order: { update_time: 'desc' },
          },
        ];
      default:
        if (isNumberOnly(debouncedSearchTerm) && new BigNumber(debouncedSearchTerm).gte(new BigNumber('9223372036854775807'))) {
          graphqlSearchOnly.current = true;
        } else {
          graphqlSearchOnly.current = false;
        }
        return [];
    }
  }, [ debouncedSearchTerm, type ]);

  React.useEffect(() => {
    if (isNumberOnly(debouncedSearchTerm) && new BigNumber(debouncedSearchTerm).gte(new BigNumber('9223372036854775807'))) {
      graphqlSearchOnly.current = true;
    }
  }, [ debouncedSearchTerm ]);
  const graphqlQuery = useGraphqlQuery('graphql_search', graphqlQuerires(), graphqlShowMoreQueries().length > 0);
  const graphqlShowMoreQuery = useGraphqlQuery('graphql_search_more', graphqlShowMoreQueries());
  const apiQuery = useApiQuery('quick_search', {
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { enabled: !graphqlSearchOnly.current && debouncedSearchTerm.trim().length > 0 },
  });

  const query = React.useMemo(() => {
    const apiData = !graphqlSearchOnly.current && !apiQuery.isPending && apiQuery.data ? apiQuery.data : [];

    if (!graphqlQuery.loading && graphqlQuery.data && !graphqlShowMoreQuery.loading && graphqlShowMoreQuery.data) {
      if (Object.keys(graphqlShowMoreQuery.data).length) {
        graphqlQuery.data[Object.keys(graphqlShowMoreQuery.data)[0]] = Object.values(graphqlShowMoreQuery.data).flat();
      }
    }

    const graphqlData = !graphqlQuery.loading && graphqlQuery.data ? Object.values(graphqlQuery.data).flat() : [];
    const isPending = (!graphqlSearchOnly.current && apiQuery.isPending) || graphqlQuery.loading;
    const isError = apiQuery.isError || graphqlQuery.error;

    return {
      data: [ ...apiData, ...graphqlData as Array<SearchResultItem> ],
      isPending,
      isError,
    };
  }, [ graphqlQuery, graphqlShowMoreQuery, apiQuery ]);

  const redirectCheckQuery = useApiQuery('search_check_redirect', {
    // on pages with regular search bar we check redirect on every search term change
    // in order to prepend its result to suggest list since this resource is much faster than regular search
    queryParams: { q: debouncedSearchTerm },
    queryOptions: { enabled: !graphqlSearchOnly.current && Boolean(debouncedSearchTerm) },
  });

  return React.useMemo(() => ({
    searchTerm,
    debouncedSearchTerm,
    handleSearchTermChange: setSearchTerm,
    query,
    redirectCheckQuery,
    pathname,
    setType,
    type,
  }), [ debouncedSearchTerm, pathname, query, redirectCheckQuery, searchTerm, setType, type ]);
}
