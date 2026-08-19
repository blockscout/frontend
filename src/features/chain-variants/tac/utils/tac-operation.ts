// SPDX-License-Identifier: LicenseRef-Blockscout

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import { rightLineArrow } from 'src/toolkit/utils/htmlEntities';

/**
 * The transfer route, and nothing else — the outcome lives in `status`. Returns `null` for
 * `UNKNOWN`, which means the operation id is indexed but its route is not known yet.
 */
export function getTacOperationRoute(type: tac.V2OperationType): string | null {
  switch (type) {
    case tac.V2OperationType.TON_TAC_TON:
      return `TON ${ rightLineArrow } TAC ${ rightLineArrow } TON`;
    case tac.V2OperationType.TAC_TON:
      return `TAC ${ rightLineArrow } TON`;
    case tac.V2OperationType.TON_TAC:
      return `TON ${ rightLineArrow } TAC`;
    default:
      return null;
  }
}

export const TAC_OPERATION_STATUS_LABELS: Record<tac.V2OperationStatus, string> = {
  [tac.V2OperationStatus.pending]: 'Pending',
  [tac.V2OperationStatus.success]: 'Success',
  [tac.V2OperationStatus.failed]: 'Failed',
  [tac.V2OperationStatus.UNRECOGNIZED]: 'Unknown',
};

/**
 * The route when it is known, otherwise the status word — the tag always carries the status icon and
 * colour, so it must never render empty.
 */
export function getTacOperationStatusText(status: tac.V2OperationStatus, type: tac.V2OperationType): string {
  return getTacOperationRoute(type) ?? TAC_OPERATION_STATUS_LABELS[status];
}

export const FAILURE_TOOLTIP = 'Failed operation';

export const ROLLBACK_TOOLTIP = 'The cross‑chain operation was reverted and the original assets and state ' +
  'were returned to the sender after a failure on the destination chain';

/**
 * Only a failure gets a tooltip; `error_reason` is a short label the API publishes when it has one, and is
 * legitimately absent in many failed states.
 */
export function getTacOperationStatusTooltip(
  status: tac.V2OperationStatus,
  errorReason: string | null | undefined,
  isRollback: boolean | undefined,
): string | null {
  if (status !== tac.V2OperationStatus.failed) {
    return null;
  }
  if (isRollback) {
    return ROLLBACK_TOOLTIP;
  }
  return errorReason ? `${ FAILURE_TOOLTIP }. ${ errorReason }` : FAILURE_TOOLTIP;
}

export function getTacOperationStage(data: tac.V2OperationDetails, txHash: string) {
  const currentStep = data.status_history.filter((step) => step.transactions.some((tx) => tx.hash.toLowerCase() === txHash.toLowerCase()));
  if (currentStep.length === 0) {
    return;
  }
  return currentStep.map((step) => STATUS_LABELS[step.type]);
}

export const STATUS_SEQUENCE: Array<tac.V2OperationStage_V2StageType> = [
  tac.V2OperationStage_V2StageType.COLLECTED_IN_TAC,
  tac.V2OperationStage_V2StageType.INCLUDED_IN_TAC_CONSENSUS,
  tac.V2OperationStage_V2StageType.EXECUTED_IN_TAC,
  tac.V2OperationStage_V2StageType.COLLECTED_IN_TON,
  tac.V2OperationStage_V2StageType.INCLUDED_IN_TON_CONSENSUS,
  tac.V2OperationStage_V2StageType.EXECUTED_IN_TON,
];

export const STATUS_LABELS: Record<tac.V2OperationStage_V2StageType, string> = {
  [tac.V2OperationStage_V2StageType.COLLECTED_IN_TAC]: 'Collected in TAC',
  [tac.V2OperationStage_V2StageType.INCLUDED_IN_TAC_CONSENSUS]: 'Included in TAC consensus',
  [tac.V2OperationStage_V2StageType.EXECUTED_IN_TAC]: 'Executed in TAC',
  [tac.V2OperationStage_V2StageType.COLLECTED_IN_TON]: 'Collected in TON',
  [tac.V2OperationStage_V2StageType.INCLUDED_IN_TON_CONSENSUS]: 'Included in TON consensus',
  [tac.V2OperationStage_V2StageType.EXECUTED_IN_TON]: 'Executed in TON',
  [tac.V2OperationStage_V2StageType.UNRECOGNIZED]: 'Unknown',
};

export const sortStatusHistory = (a: tac.V2OperationStage, b: tac.V2OperationStage) => {
  const aIndex = STATUS_SEQUENCE.indexOf(a.type);
  const bIndex = STATUS_SEQUENCE.indexOf(b.type);
  return aIndex - bIndex;
};
