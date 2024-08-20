import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import useDebounce from 'lib/hooks/useDebounce';

export default function useQuickSearchQueryStorage() {
  const router = useRouter();

  const [ searchTerm, setSearchTerm ] = React.useState('');
  const [ type, setType ] = React.useState('default');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pathname = router.pathname;

  React.useEffect(() => {
    setType('default');
  }, [ debouncedSearchTerm ]);

  const graphqlQuerires = React.useCallback(() => {
    switch (type) {
      case 'default':
      default:
        return [
          {
            tableName: 'object',
            fields: [
              'id',
              'object_name',
              'owner',
            ],
            limit: 6,
            offset: 0,
            where: { object_name: { _ilike: `%${ debouncedSearchTerm }%` } },
          },
          {
            tableName: 'bucket',
            fields: [
              'id',
              'bucket_name',
              'owner',
            ],
            limit: 6,
            offset: 0,
            where: { bucket_name: { _ilike: `%${ debouncedSearchTerm }%` } },
          },
        ];
      case 'object':
        return [
          {
            tableName: 'object',
            fields: [
              'id',
              'object_name',
              'owner',
            ],
            limit: 50,
            offset: 0,
            where: { object_name: { _ilike: `%${ debouncedSearchTerm }%` } },
          },
        ];
      case 'bucket':
        return [
          {
            tableName: 'bucket',
            fields: [
              'id',
              'bucket_name',
              'owner',
            ],
            limit: 50,
            offset: 0,
            where: { bucket_name: { _ilike: `%${ debouncedSearchTerm }%` } },
          },
        ];
    }
  }, [ debouncedSearchTerm, type ]);
  const query = useGraphqlQuery('graphql_search', graphqlQuerires());
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
    setType,
    type,
  }), [ debouncedSearchTerm, pathname, query, redirectCheckQuery, searchTerm, type ]);
}
