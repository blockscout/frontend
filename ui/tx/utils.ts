import type * as tac from '@blockscout/tac-operation-lifecycle-types';

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

  return [
    typeTag ? { slug: 'tac_operation_type', name: typeTag, tagType: 'custom' as const, ordinal: 0, data: typeTag } : null,
  ].filter(Boolean);
}
