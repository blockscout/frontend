import { useQuery } from '@tanstack/react-query';
import { uniq, chunk } from 'es-toolkit';
import React from 'react';

import type { NovesDescribeTxsResponse } from 'types/api/noves';
import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';

const feature = config.features.txInterpretation;

const translateEnabled = feature.isEnabled && feature.provider === 'noves';

export default function useDescribeTxs(items: Array<Transaction> | undefined, viewAsAccountAddress: string | undefined, isPlaceholderData: boolean) {
  const apiFetch = useApiFetch();

  const txsHash = items ? uniq(items.map(i => i.hash)) : [];
  const txChunks = chunk(txsHash, 10);

  const queryKey = {
    viewAsAccountAddress,
    firstHash: txsHash[0] || '',
    lastHash: txsHash[txsHash.length - 1] || '',
  };

  const describeQuery = useQuery({
    queryKey: [ 'noves_describe_txs', queryKey ],
    queryFn: async() => {
      const queries = txChunks.map((hashes) => {
        if (hashes.length === 0) {
          return Promise.resolve([]);
        }

        return apiFetch('general:noves_describe_txs', {
          queryParams: {
            viewAsAccountAddress,
            hashes,
          },
        }) as Promise<NovesDescribeTxsResponse>;
      });

      return Promise.all(queries);
    },
    select: (data) => {
      return data.flat();
    },
    enabled: translateEnabled && !isPlaceholderData,
  });

  const itemsWithTranslation = React.useMemo(() => items?.map(tx => {
    const queryData = describeQuery.data;
    const isLoading = describeQuery.isLoading;

    if (isLoading) {
      return {
        ...tx,
        translation: {
          isLoading,
        },
      };
    }

    if (!queryData || !translateEnabled) {
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

    return tx;
  }), [ items, describeQuery.data, describeQuery.isLoading ]);

  if (!translateEnabled || isPlaceholderData) {
    return items;
  }

  // return same "items" array of Transaction with a new "translation" field.
  return itemsWithTranslation;
}
