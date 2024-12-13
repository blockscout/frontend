import { useQuery, gql } from '@apollo/client';

interface QueryConfig {
  tableName: string;
  fields?: Array<string | FieldConfig>;
  limit?: number;
  offset?: number;
  distinctOn?: string;
  where?: Record<string, any>;
  order?: Record<string, string>;
  aggregate?: Array<string>;
}

interface QueryResult {
  [x: string]: any;
  loading: boolean;
  error: Error | undefined;
  data: Record<string, any> | null;
}

interface FieldConfig {
  field: string;
  where?: Record<string, any>;
  subfields?: Array<string>;
}

/**
 * Custom Hook to perform multi-table GraphQL queries with support for where conditions and ordering.
 * @param {string} aliasName - The alias name for the query.
 * @param {QueryConfig[]} queries - An array of query configurations.
 * @param {boolean} cached - Whether the result could be cached
 * @returns {QueryResult} - Returns the loading, error, and data states from the query.
 */
const useGraphqlQuery = (aliasName: string, queries: Array<QueryConfig>, cached?: boolean): QueryResult => {
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
    if (!where) {
      return '';
    }

    if (typeof where === 'object' && where !== null) {
      return Object.entries(where)
        .map(([ key, value ]) => {
          if (key === '_or' || key === '_and' || key === '_not') {
            const conditions = Array.isArray(value) ? value : [ value ];
            return `${ key }: [${ conditions.map(cond => `{${ formatObjectToGraphQL(cond) }}`).join(', ') }]`;
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return `${ key }: { ${ formatObjectToGraphQL(value) } }`;
          }
          return `${ key }: ${ JSON.stringify(value) }`;
        })
        .join(', ');
    }
    return '';
  };

  const EMPTY_QUERY = gql`
  query {
    __typename
  }
`;

  // Function to build query fields string for aggregation
  const buildAggregationFields = (aggregates: Array<string>): string => {
    return aggregates.map(aggregate => `${ aggregate }`).join(' ');
  };

  const formatFields = (fields?: Array<string | FieldConfig>): string => {
    if (!fields) {
      return '';
    }
    return fields
      .map(field => {
        if (typeof field === 'string') {
          return field;
        } else if (typeof field === 'object' && field.field) {
          const whereCondition = field.where ? `(where: { ${ formatWhereCondition(field.where) } })` : '';
          const subfields = field.subfields?.length ?
            `{ ${ field.subfields.join(' ') } }` :
            '';
          return `${ field.field }${ whereCondition } ${ subfields }`;
        }
        return '';
      })
      .join(' ');
  };

  const query = queries.length ? gql`
    query ${ aliasName }($limit: Int, $offset: Int) {
      ${ queries
    .map(
      ({ tableName, fields, limit, offset, where, order, aggregate, distinctOn }) => {
        // Handle aggregation queries
        if (aggregate && aggregate.length > 0) {
          return `
            ${ tableName }(
              where: { ${ formatWhereCondition(where) } },
              ${ distinctOn ? `distinct_on: [${ distinctOn }],` : '' }
            ) {
              aggregate {
                ${ buildAggregationFields(aggregate) }
              }
            }
          `;
        }
        // Handle regular queries
        return `
          ${ tableName }(
            where: { ${ formatWhereCondition(where) } },
            ${ distinctOn ? `distinct_on: [${ distinctOn }],` : '' }
            ${ order ? `order_by: { ${ Object.keys(order)[0] }: ${ Object.values(order) } },` : '' }
            ${ limit !== undefined ? `limit: $limit,` : '' }
            ${ offset !== undefined ? `offset: $offset` : '' }
          ) {
            ${ formatFields(fields) }
          }
        `;
      })
    .join('\n') }
    }
  ` : EMPTY_QUERY;

  const { loading, error, data } = useQuery(query, {
    skip: query === EMPTY_QUERY,
    variables: query !== EMPTY_QUERY ? { limit: queries[0].limit, offset: queries[0].offset } : {},
    fetchPolicy: cached ? 'cache-first' : 'no-cache',
  });

  const result = queries.reduce<Record<string, any>>((acc, { tableName }) => {
    if (data && data[tableName]) {

      // Check if tableData is an array or an object
      if (Array.isArray(data[tableName])) {
        const tableData = data[tableName] as Array<Record<string, any>>;
        acc[tableName] = tableData.map((item: Record<string, any>) => {
          return {
            ...item,
            type: item.__typename,
            __typename: undefined,
          };
        });
      } else if (typeof data[tableName] === 'object') {
        const tableData = data[tableName];
        acc[tableName] = {
          ...tableData,
          type: tableData.__typename,
          __typename: undefined,
        };
      } else {
        acc[tableName] = null;
      }
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
