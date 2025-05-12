import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { STATUS_LABELS } from 'ui/operation/tac/utils';

export function getTacOperationTags(data: tac.OperationDetails, txHash: string) {
  const typeTag = (() => {
    // TODO @tom2drum remove "as unknown" once the type is fixed
    switch (data.type as unknown) {
      case 'TON_TAC_TON':
        return 'TON > TAC > TON';
      case 'TAC_TON':
        return 'TAC > TON';
      case 'TON_TAC':
        return 'TON > TAC';
      case 'ERROR':
        return 'Rollback';
      case 'PENDING':
        return 'Pending';
      default:
        return null;
    }
  })();

  const statusTag = (() => {
    const currentStep = data.status_history.find((step) => step.transactions.some((tx) => tx.hash.toLowerCase() === txHash.toLowerCase()));
    if (!currentStep) {
      return null;
    }
    return STATUS_LABELS[currentStep.type];
  })();

  return [
    statusTag ? { slug: 'tac_operation_status', name: statusTag, tagType: 'custom' as const, ordinal: 0, data: statusTag } : null,
    typeTag ? { slug: 'tac_operation_type', name: typeTag, tagType: 'custom' as const, ordinal: 0, data: typeTag } : null,
  ].filter(Boolean);
}
