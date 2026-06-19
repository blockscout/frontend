// SPDX-License-Identifier: LicenseRef-Blockscout

import { ARBITRUM_L2_TX_BATCH_STATUSES, type ArbitrumBatchStatus } from '../types/api';
import type { schemas } from '@blockscout/api-types';
import type { ExcludeUndefined } from 'src/shared/types/utils';

import config from 'src/config';

const rollupFeature = config.features.rollup;

const parentChainName = rollupFeature.isEnabled ? rollupFeature.parentChain.name : undefined;

export const VERIFICATION_STEPS_MAP: Record<ArbitrumBatchStatus, string> = {
  'Processed on rollup': 'Processed on rollup',
  'Sealed on rollup': 'Sealed on rollup',
  'Sent to base': parentChainName ? `Sent to ${ parentChainName }` : 'Sent to parent chain',
  'Confirmed on base': parentChainName ?
    `Confirmed on ${ parentChainName }` :
    'Confirmed on parent chain',
};

export const verificationSteps = (() => {
  return ARBITRUM_L2_TX_BATCH_STATUSES.map((status) => VERIFICATION_STEPS_MAP[status]);
})();

export function getVerificationStepStatus({
  status,
  commitment_transaction: commitTx,
  confirmation_transaction: confirmTx,
}: Pick<ExcludeUndefined<schemas['TransactionResponse']['arbitrum']>, 'status' | 'commitment_transaction' | 'confirmation_transaction'>) {
  if (status === 'Sent to base') {
    if (commitTx?.status === 'unfinalized') {
      return 'pending';
    }
  }
  if (status === 'Confirmed on base') {
    if (confirmTx?.status === 'unfinalized') {
      return 'pending';
    }
  }
  return 'finalized';
}
