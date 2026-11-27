// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';
import type { TxInterpretationSummary } from 'src/features/tx-interpretation/common/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

interface Params {
  readonly hash: string;
  readonly status: schemas['TransactionResponse']['status'];
  readonly isTxLoading: boolean;
}

interface TxReceiptInterpretation {
  readonly summaries: ReadonlyArray<TxInterpretationSummary> | undefined;
  readonly isLoading: boolean;
}

export function useTxReceiptInterpretation({ hash, status, isTxLoading }: Params): TxReceiptInterpretation {
  const multichainContext = useMultichainContext();
  const feature = multichainContext?.chain?.app_config.features.txInterpretation || config.features.txInterpretation;

  // the endpoint has nothing for a pending transaction; asking only once it settles fetches the headline when it does
  const isEnabled = getFeaturePayload(feature)?.provider === 'blockscout' && Boolean(hash) && !isTxLoading && status !== null;

  const query = useApiQuery('core:tx_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: isEnabled,
    },
  });

  return {
    summaries: isEnabled ? query.data?.data.summaries : undefined,
    isLoading: isEnabled && query.isPending,
  };
}
