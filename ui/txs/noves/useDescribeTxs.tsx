import type { UseQueryResult } from '@tanstack/react-query';
import _ from 'lodash';

import type { NovesDescribeTxsResponse } from 'types/api/noves';
import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
// import useApiQuery from 'lib/api/useApiQuery';

export interface DescribeTxs {
  txHash: string;
  type?: string;
  description?: string;
  isLoading: boolean;
  enabled: boolean;
}

export interface TransactionWithTranslate extends Transaction {
  translate?: DescribeTxs;
}

const feature = config.features.txInterpretation;

const translateEnabled = feature.isEnabled && feature.provider === 'noves';

export default function useDescribeTxs(items: Array<Transaction> | undefined, viewAsAccountAddress: string | undefined) {
  const txsHash = items?.map(i => i.hash);
  const txsChunk = _.chunk(txsHash || [], 10);

  const txsParams = Array(5).fill(undefined).map((_, i) => txsChunk[i]);
  const txsQuerys = useFetchTxs(txsParams, viewAsAccountAddress);

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
function useFetchTxs(txs: Array<Array<string>>, viewAsAccountAddress: string | undefined) {
  const txsQuerys = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const body of txs) {
    // loop to avoid writing 5 hook calls.
    // txs will always have the same length so we always execute the same amount of hooks

    // Need to fix implementation here to handle translateEnabled correctly, and verify the calls to describeTxs proxy are working correctly
    // const query = useApiQuery('noves_describe_txs', {
    //   queryParams: {
    //     viewAsAccountAddress: viewAsAccountAddress,
    //     hashes: body,
    //   },
    // });

    // txsQuerys.push(query);

    txsQuerys.push({} as UseQueryResult<NovesDescribeTxsResponse, ResourceError<unknown>>);
  }

  return txsQuerys;
}
