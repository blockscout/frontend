// SPDX-License-Identifier: LicenseRef-Blockscout

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { rightLineArrow } from 'src/toolkit/utils/htmlEntities';

/**
 * The v1 `type` mixed the transfer route, the state and a failure reason into one field, so its label is
 * neither a pure route nor a pure status. Only the search surfaces still receive that shape — see
 * `SearchResultTacOperationStatus` for why, and https://github.com/blockscout/frontend/issues/3627 for when
 * this file goes away.
 */
export function getLegacyTacOperationLabel(type: tac.OperationType): string | null {
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
    case tac.OperationType.INSUFFICIENT_FEE:
      return 'Insufficient fee';
    case tac.OperationType.PENDING:
      return 'Pending';
    default:
      return null;
  }
}

/**
 * The pending spinner is the only thing the search rows need from `status`, and `PENDING` is the one v1
 * `type` that maps to it without ambiguity.
 */
export function getLegacyTacOperationStatus(type: tac.OperationType): tac.V2OperationStatus | undefined {
  return type === tac.OperationType.PENDING ? tac.V2OperationStatus.pending : undefined;
}
