import _ from 'lodash';
import { useMemo } from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

const feature = config.features.txInterpretation;

const translateEnabled = feature.isEnabled && feature.provider === 'noves';

export default function useDescribeTxs(items: Array<Transaction> | undefined, viewAsAccountAddress: string | undefined) {
  const txsHash = _.uniq(items?.map(i => i.hash));

  const txsQueries = useFetchTxs(txsHash, viewAsAccountAddress);

  const isLoading = useMemo(() => txsQueries.some(query => query.isLoading || query.isPlaceholderData), [ txsQueries ]);
  const queryData = useMemo(() => txsQueries.map(query => query.data ? query.data : []).flat(), [ txsQueries ]);

  const data: Array<Transaction> | undefined = useMemo(() => items?.map(tx => {
    if (!translateEnabled) {
      // Can't return earlier because of hooks order
      return tx;
    }

    const query = queryData.find(data => data.txHash.toLowerCase() === tx.hash.toLowerCase());

    if (query) {
      return {
        ...tx,
        translation: {
          data: query,
          isLoading: false,
        },
      };
    }

    return {
      ...tx,
      translation: {
        isLoading,
      },
    };
  }), [ items, queryData, isLoading ]);

  // return same "items" array of Transaction with a new "translation" field.

  return data;
}

function useFetchTxs(txsHash: Array<string>, viewAsAccountAddress: string | undefined) {
  // we need to send 10 txs per call
  const txsHashChunk = _.chunk(txsHash, 10);

  const txsQueries = [];

  // loop to avoid writing 5 hook calls.
  for (let index = 0; index < 5; index++) {

    const body = txsHashChunk[index];

    // we always execute the same amount of hooks

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const query = useApiQuery('noves_describe_txs', {
      queryParams: {
        viewAsAccountAddress: viewAsAccountAddress,
        hashes: body,
      },
      queryOptions: {
        enabled: translateEnabled && Boolean(body),
      },
    });

    txsQueries.push(query);
  }

  return txsQueries;
}
