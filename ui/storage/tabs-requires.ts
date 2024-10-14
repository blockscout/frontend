/* eslint-disable no-console */
import useGraphqlQuery from 'lib/api/useGraphqlQuery';

type TokenType = 'Transactions' | 'Versions'

const map = {
  Transactions: [
    {
      tableName: 'transactions',
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

export const Requires = (payload: TokenType, page: number) => {
  console.log(page);
  const queries = map[payload];

  const { loading, data } = useGraphqlQuery('Objects', queries);
  return { loading, data };
};
