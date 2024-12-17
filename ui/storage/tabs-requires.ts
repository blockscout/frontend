/* eslint-disable no-console */
// import useGraphqlQuery from 'lib/api/useGraphqlQuery';

type TokenType = 'Transactions' | 'Versions'

const map = (id: number, page: number) => {
  return {
    Transactions: [
      {
        tableName: 'object_events',
        fields: [
          'object_id',
          'event',
          'evm_tx_hash',
          'height',
        ],
        limit: 21,
        where: { object_id: { _eq: id } },
        offset: page,
      },
    ],
    Versions: [
      {
        tableName: 'versions',
        fields: [
          'gas_used',
          'gas_wanted',
          'logs',
          'memo',
          'raw_log',
          'messages',
          'hash',
        ],
      },
    ],
  };
};

export const Requires = (payload: TokenType, page: number, id: number) => {
  const queries = id ? map(id, page)[payload] : [];

  // const { loading, data } = useGraphqlQuery('Objects', queries);
  return queries;
};
