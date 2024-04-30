import type { ContractMethodCallResult } from '../types';
import type { SmartContractMethod } from 'types/api/contract';

export interface ResultComponentProps<T extends SmartContractMethod> {
  item: T;
  result: ContractMethodCallResult<T>;
  onSettle: () => void;
}
