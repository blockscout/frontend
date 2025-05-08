import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { STATUS_LABELS } from 'ui/operation/tac/utils';

export function getTacOperationTags(data: tac.OperationDetails) {
  const typeTag = (() => {
    switch (data.type) {
      case 'TON_TAC_TON':
        return 'TON > TAC > TON';
      case 'TAC_TON':
        return 'TAC > TON';
      case 'TON_TAC':
        return 'TON > TAC';
      case 'ERROR':
        return 'Rollback';
      default:
        return null;
    }
  })();

  const statusTag = (() => {
    const currentStatus = data.status_history[data.status_history.length - 1].type;
    return STATUS_LABELS[currentStatus];
  })();

  return [
    statusTag ? { slug: 'tac_operation_status', name: statusTag, tagType: 'custom' as const, ordinal: 0, data: statusTag } : null,
    typeTag ? { slug: 'tac_operation_type', name: typeTag, tagType: 'custom' as const, ordinal: 0, data: typeTag } : null,
  ].filter(Boolean);
}
