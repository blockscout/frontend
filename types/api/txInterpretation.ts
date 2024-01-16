import type { AddressParam } from 'types/api/addressParams';
import type { TokenInfo } from 'types/api/token';

export interface TxInterpretationResponse {
  data: {
    summaries: Array<TxInterpretationSummary>;
  };
}

export type TxInterpretationSummary = {
  summary_template: string;
  summary_template_variables: Record<string, TxInterpretationVariable>;
}

export type TxInterpretationVariable =
  TxInterpretationVariableString |
  TxInterpretationVariableCurrency |
  TxInterpretationVariableTimestamp |
  TxInterpretationVariableToken |
  TxInterpretationVariableAddress;

export type TxInterpretationVariableType = 'string' | 'currency' | 'timestamp' | 'token' | 'address';

export type TxInterpretationVariableString = {
  type: 'string';
  value: string;
}

export type TxInterpretationVariableCurrency = {
  type: 'currency';
  value: string;
}

export type TxInterpretationVariableTimestamp = {
  type: 'timestamp';
  value: string;
}

export type TxInterpretationVariableToken = {
  type: 'token';
  value: TokenInfo;
}

export type TxInterpretationVariableAddress = {
  type: 'address';
  value: AddressParam;
}
