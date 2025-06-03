import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { rightLineArrow } from 'toolkit/utils/htmlEntities';
import { STATUS_LABELS } from 'ui/operation/tac/utils';

export function getTacOperationStatus(type: tac.OperationType) {
  switch (type) {
    case tac.OperationType.TON_TAC_TON:
      return `TON ${ rightLineArrow } TAC ${ rightLineArrow } TON`;
    case tac.OperationType.TAC_TON:
      return `TAC ${ rightLineArrow } TON`;
    case tac.OperationType.TON_TAC:
      return `TON ${ rightLineArrow } TAC`;
    case tac.OperationType.ERROR:
      return 'Error';
    case tac.OperationType.ROLLBACK:
      return 'Rollback';
    case tac.OperationType.PENDING:
      return 'Pending';
    default:
      return null;
  }
}

export function getTacOperationStage(data: tac.OperationDetails, txHash: string) {
  const currentStep = data.status_history.find((step) => step.transactions.some((tx) => tx.hash.toLowerCase() === txHash.toLowerCase()));
  if (!currentStep) {
    return null;
  }
  return STATUS_LABELS[currentStep.type];
}
