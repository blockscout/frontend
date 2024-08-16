import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import useDebounce from 'lib/hooks/useDebounce';

export default function useQuickSearchQueryStorage() {
  const router = useRouter();

  const [ searchTerm, setSearchTerm ] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pathname = router.pathname;

  const graphqlQuerires = [
    {
      tableName: 'object',
      fields: [
        'bucket_name',
        'checksums',
        'content_type',
        'create_at',
        'creator',
        'height',
        'id',
        'is_updating',
        'local_virtual_group_id',
        'object_name',
        'object_status',
        'owner',
        'payload_size',
        'redundancy_type',
        'source_type',
        'tags',
        'updated_at',
        'updated_by',
        'version',
        'visibility',
      ],
      limit: 5,
      offset: 0,
      where: { object_name: `%${ debouncedSearchTerm }%` },
    },
  ];
  const query = useGraphqlQuery('graphql_search', graphqlQuerires);
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
