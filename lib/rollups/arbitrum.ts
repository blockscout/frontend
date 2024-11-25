import { ARBITRUM_L2_TX_BATCH_STATUSES, type ArbitrumBatchStatus, type ArbitrumL2TxData } from 'types/api/arbitrumL2';

import config from 'configs/app';

const rollupFeature = config.features.rollup;

type Args = {
  status: ArbitrumBatchStatus;
  commitment_transaction: ArbitrumL2TxData;
  confirmation_transaction: ArbitrumL2TxData;
};

export const VERIFICATION_STEPS_MAP: Record<ArbitrumBatchStatus, string> = {
  'Processed on rollup': 'Processed on rollup',
  'Sent to base': rollupFeature.isEnabled && rollupFeature.parentChainName ? `Sent to ${ rollupFeature.parentChainName }` : 'Sent to parent chain',
  'Confirmed on base': rollupFeature.isEnabled && rollupFeature.parentChainName ?
    `Confirmed on ${ rollupFeature.parentChainName }` :
    'Confirmed on parent chain',
};

export const verificationSteps = (() => {
  return ARBITRUM_L2_TX_BATCH_STATUSES.map((status) => VERIFICATION_STEPS_MAP[status]);
})();

export function getVerificationStepStatus({
  status,
  commitment_transaction: commitTx,
  confirmation_transaction: confirmTx,
}: Args) {
  if (status === 'Sent to base') {
    if (commitTx.status === 'unfinalized') {
      return 'pending';
    }
  }
  if (status === 'Confirmed on base') {
    if (confirmTx.status === 'unfinalized') {
      return 'pending';
    }
  }
  return 'finalized';
}
