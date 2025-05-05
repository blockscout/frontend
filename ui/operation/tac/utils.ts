import * as tac from '@blockscout/tac-operation-lifecycle-types';

export const STATUS_SEQUENCE: Array<tac.OperationStage_StageType> = [
  tac.OperationStage_StageType.COLLECTED_IN_TAC,
  tac.OperationStage_StageType.INCLUDED_IN_TAC_CONSENSUS,
  tac.OperationStage_StageType.EXECUTED_IN_TAC,
  tac.OperationStage_StageType.COLLECTED_IN_TON,
  tac.OperationStage_StageType.INCLUDED_IN_TON_CONSENSUS,
  tac.OperationStage_StageType.EXECUTED_IN_TON,
];

export const STATUS_LABELS: Record<tac.OperationStage_StageType, string> = {
  [tac.OperationStage_StageType.COLLECTED_IN_TAC]: 'Collected in TAC',
  [tac.OperationStage_StageType.INCLUDED_IN_TAC_CONSENSUS]: 'Included in TAC consensus',
  [tac.OperationStage_StageType.EXECUTED_IN_TAC]: 'Executed in TAC',
  [tac.OperationStage_StageType.COLLECTED_IN_TON]: 'Collected in TON',
  [tac.OperationStage_StageType.INCLUDED_IN_TON_CONSENSUS]: 'Included in TON consensus',
  [tac.OperationStage_StageType.EXECUTED_IN_TON]: 'Executed in TON',
  [tac.OperationStage_StageType.UNRECOGNIZED]: 'Unknown',
};

export const sortStatusHistory = (a: tac.OperationStage, b: tac.OperationStage) => {
  const aIndex = STATUS_SEQUENCE.indexOf(a.type);
  const bIndex = STATUS_SEQUENCE.indexOf(b.type);
  return aIndex - bIndex;
};
