import type { DocumentNode } from '@apollo/client';
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
      .map(([ key, value ]) => `${ key }: ${ JSON.stringify(value) }`)
      .join(', ');
  };

  // Dynamically build the GraphQL query string
  const query: DocumentNode = gql`
    query ${ aliasName }($limit: Int, $offset: Int) {
      ${ queries.map(({ tableName, fields, limit, offset, where, order }) => `
        ${ tableName } (
          ${ where ? `where: { ${ formatObjectToGraphQL(where) } },` : '' }
          ${ order ? `order_by: { ${ formatObjectToGraphQL(order) } },` : '' }
          ${ limit !== undefined ? `limit: $limit,` : '' }
          ${ offset !== undefined ? `offset: $offset` : '' }
        ) {
          ${ fields.join(' ') }  
        }
      `).join('\n') }
    }
  `;

  // Execute the query using Apollo's useQuery Hook
  const { loading, error, data } = useQuery(query, {
    variables: { limit: queries[0].limit, offset: queries[0].offset },
  });

  // Structure the returned data to make it more usable
  const result = queries.reduce<Record<string, any>>((acc, { tableName }) => {
    acc[tableName] = data ? data[tableName] : null;
    return acc;
  }, {});

  return {
    loading,
    error,
    data: result,
  };
};

export default useGraphqlQuery;
