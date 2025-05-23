import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { rightLineArrow } from 'toolkit/utils/htmlEntities';
import { STATUS_LABELS } from 'ui/operation/tac/utils';

export function getTacOperationStatus(type: tac.OperationType) {
  // TODO @tom2drum remove "as unknown" once the type is fixed
  switch (type as unknown) {
    case 'TON_TAC_TON':
      return `TON ${ rightLineArrow } TAC ${ rightLineArrow } TON`;
    case 'TAC_TON':
      return `TAC ${ rightLineArrow } TON`;
    case 'TON_TAC':
      return `TON ${ rightLineArrow } TAC`;
    case 'ERROR':
      return 'Rollback';
    case 'PENDING':
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
