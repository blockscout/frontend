import * as tac from '@blockscout/tac-operation-lifecycle-types';

export const STATUS_SEQUENCE: Array<tac.OperationStage_StageType> = [
  tac.OperationStage_StageType.CollectedInTAC,
  tac.OperationStage_StageType.IncludedInTACConsensus,
  tac.OperationStage_StageType.ExecutedInTAC,
  tac.OperationStage_StageType.CollectedInTON,
  tac.OperationStage_StageType.IncludedInTONConsensus,
  tac.OperationStage_StageType.ExecutedInTON,
];

export const STATUS_LABELS: Record<tac.OperationStage_StageType, string> = {
  [tac.OperationStage_StageType.CollectedInTAC]: 'Collected in TAC',
  [tac.OperationStage_StageType.IncludedInTACConsensus]: 'Included in TAC consensus',
  [tac.OperationStage_StageType.ExecutedInTAC]: 'Executed in TAC',
  [tac.OperationStage_StageType.CollectedInTON]: 'Collected in TON',
  [tac.OperationStage_StageType.IncludedInTONConsensus]: 'Included in TON consensus',
  [tac.OperationStage_StageType.ExecutedInTON]: 'Executed in TON',
  [tac.OperationStage_StageType.UNRECOGNIZED]: 'Unknown',
};

export const sortStatusHistory = (a: tac.OperationStage, b: tac.OperationStage) => {
  const aIndex = STATUS_SEQUENCE.indexOf(a.type);
  const bIndex = STATUS_SEQUENCE.indexOf(b.type);
  return aIndex - bIndex;
};
