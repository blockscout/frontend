import type { ArbitrumBatchStatus, ArbitrumL2TxData } from 'types/api/arbitrumL2';

type Args = {
  status: ArbitrumBatchStatus;
  commitment_transaction: ArbitrumL2TxData;
  confirmation_transaction: ArbitrumL2TxData;
};

export default function getArbitrumVerificationStepStatus({
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
