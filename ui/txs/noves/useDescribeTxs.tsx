import type { UseQueryResult } from '@tanstack/react-query';
import _ from 'lodash';

import type { NovesDescribeTxsResponse } from 'types/api/noves';
import type { Transaction } from 'types/api/transaction';

import type { ResourceError } from 'lib/api/resources';

export interface DescribeTxs {
  txHash: string;
  type?: string;
  description?: string;
  isLoading: boolean;
  enabled: boolean;
}

export interface TransactionWithTranslate extends Transaction {
  translate: DescribeTxs;
}

export default function useDescribeTxs(items: Array<Transaction> | undefined, translateEnabled: boolean) {
  const txsHash = items?.map(i => i.hash);
  const txsChunk = _.chunk(txsHash || [], 10);

  const txsParams = Array(5).fill(undefined).map((_, i) => txsChunk[i]);
  const txsQuerys = useFetchTxs(txsParams, translateEnabled);

  const isLoading = txsQuerys.some(query => query.isLoading || query.isPlaceholderData);
  const queryData = txsQuerys.map(query => query.data ? query.data : []).flat();

  const data: Array<TransactionWithTranslate> | undefined = items?.map(tx => {
    const query = queryData.find(data => data.txHash === tx.hash);

    if (query) {
      return {
        ...tx,
        translate: {
          ...query,
          isLoading: false,
          enabled: translateEnabled,
        },
      };
    }

    return {
      ...tx,
      translate: {
        txHash: tx.hash,
        isLoading,
        enabled: translateEnabled,
      },
    };
  });

  // return same "items" array of Transaction with a new "translate" field.

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useFetchTxs(txs: Array<Array<string>>, translateEnabled: boolean) {
  const txsQuerys = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const body of txs) {
    // loop to avoid writing 5 hook calls.
    // txs will always have the same length so we always execute the same amount of hooks

    /*
  ---- This will be available once the proxy for this endpoint is ready ----

    const query = useApiQuery('noves_describe_txs', {
      fetchParams: {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      queryOptions: {
        enabled: translateEnabled && Boolean(body),
      },
    });

    txsQuerys.push(query);
    */

    txsQuerys.push({} as UseQueryResult<NovesDescribeTxsResponse, ResourceError<unknown>>);
  }

  return txsQuerys;
}
