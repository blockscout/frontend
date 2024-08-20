import { useQuery, gql } from '@apollo/client';

interface QueryConfig {
  tableName: string;
  fields: Array<string>;
  limit?: number;
  offset?: number;
  where?: Record<string, any>;
  order?: Record<string, 'ASC' | 'DESC'>;
}

interface QueryResult {
  loading: boolean;
  error: Error | undefined;
  data: Record<string, any> | null;
}

/**
 * Custom Hook to perform multi-table GraphQL queries with support for where conditions and ordering.
 * @param {string} aliasName - The alias name for the query.
 * @param {QueryConfig[]} queries - An array of query configurations.
 * @returns {QueryResult} - Returns the loading, error, and data states from the query.
 */
const useGraphqlQuery = (aliasName: string, queries: Array<QueryConfig>): QueryResult => {
  // Helper function to convert an object to a GraphQL filter string
  const formatObjectToGraphQL = (obj: Record<string, any>): string => {
    return Object.entries(obj)
      .map(([ key, value ]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `${ key }: { ${ formatObjectToGraphQL(value) } }`;
        } else if (Array.isArray(value)) {
          return `${ key }: [${ value.map(v => {
            if (typeof v === 'object' && v !== null) {
              return `{ ${ formatObjectToGraphQL(v as Record<string, any>) } }`;
            }
            throw new Error('Array elements must be objects');
          }).join(', ') }]`;
        }
        return `${ key }: ${ JSON.stringify(value) }`;
      })
      .join(', ');
  };

  const formatWhereCondition = (where: Record<string, any> | undefined): string => {
    if (typeof where === 'object' && where !== null) {
      return Object.entries(where)
        .map(([ key, value ]) => {
          if (key === '_or' || key === '_and' || key === '_not') {
            const conditions = Array.isArray(value) ? value : [ value ];
            return `${ key }: [${ conditions.map(cond => `${ formatObjectToGraphQL(cond) }`).join(', ') }]`;
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return `${ key }: { ${ formatObjectToGraphQL(value) } }`;
          }
          return `${ key }: ${ JSON.stringify(value) }`;
        })
        .join(', ');
    }
    return '';
  };

  const query = gql`
    query ${ aliasName }($limit: Int, $offset: Int) {
      ${ queries
    .map(
      ({ tableName, fields, limit, offset, where, order }) => `
        ${ tableName } (
          where: { ${ formatWhereCondition(where) } },
          ${ order ? `order_by: { ${ formatObjectToGraphQL(order) } },` : '' }
          ${ limit !== undefined ? `limit: $limit,` : '' }
          ${ offset !== undefined ? `offset: $offset` : '' }
        ) {
          ${ fields.join(' ') }
        }
      `,
    )
    .join('\n') }
    }
  `;

  // Execute the query using Apollo's useQuery Hook
  const { loading, error, data } = useQuery(query, {
    variables: { limit: queries[0].limit, offset: queries[0].offset },
  });

  // Structure the returned data to make it more usable
  const result = queries.reduce<Record<string, any>>((acc, { tableName }) => {
    if (data && data[tableName]) {
      acc[tableName] = data[tableName].map((item: Record<string, any>) => {
        return {
          ...item,
          type: item.__typename,
          __typename: undefined, // Optionally remove __typename
        };
      });
    } else {
      acc[tableName] = null;
    }
    return acc;
  }, {});

  return {
    loading,
    error,
    data: result,
  };
};

export default useGraphqlQuery;
