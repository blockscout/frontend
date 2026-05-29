// SPDX-License-Identifier: LicenseRef-Blockscout

import { uniq, chunk } from 'es-toolkit';
import React from 'react';

import type { Transaction } from 'src/slices/tx/types/api';

import type { ReturnType } from 'src/api/hooks/useApiQueries';
import useApiQueries from 'src/api/hooks/useApiQueries';

import config from 'src/config';

const feature = config.features.txInterpretation;

const translateEnabled = feature.isEnabled && feature.provider === 'noves';

export type TxsTranslationQuery = ReturnType<'core:noves_describe_txs'> | undefined;

export default function useDescribeTxs(
  items: Array<Transaction> | undefined,
  viewAsAccountAddress: string | undefined,
  isPlaceholderData: boolean,
): TxsTranslationQuery {
  const enabled = translateEnabled && !isPlaceholderData;
  const chunks = React.useMemo(() => {
    if (!enabled) {
      return [];
    }

    const txsHash = items ? uniq(items.map(({ hash }) => hash)) : [];
    return chunk(txsHash, 10);
  }, [ items, enabled ]);

  const query = useApiQueries(
    'core:noves_describe_txs',
    chunks.map((hashes) => {
      return {
        queryParams: {
          viewAsAccountAddress,
          hashes,
        },
      };
    }),
    { enabled },
  );

  return enabled ? query : undefined;
}
