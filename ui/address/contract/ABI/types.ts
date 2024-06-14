import type { AbiFunction } from 'abitype';

import type { SmartContractMethod } from '../types';
import type { SmartContractMethodOutput } from 'types/api/contract';

// TODO @tom2drum remove these types
export type ContractAbiItemInput = AbiFunction['inputs'][number] & { fieldType?: 'native_coin' };
export type ContractAbiItemOutput = SmartContractMethodOutput;
export type ContractAbiItem = SmartContractMethod;
export type ContractAbi = Array<ContractAbiItem>;

// TODO @tom2drum move this type up to the tree
export type MethodType = 'read' | 'write';
export type MethodCallStrategy = 'read' | 'write' | 'simulate';

export interface FormSubmitResultPublicClient {
  source: 'public_client';
  data: unknown | Error;
}
export interface FormSubmitResultWalletClient {
  source: 'wallet_client';
  data: { hash: `0x${ string }` } | Error;
}
export type FormSubmitResult = FormSubmitResultPublicClient | FormSubmitResultWalletClient;

export type FormSubmitHandler = (item: SmartContractMethod, args: Array<unknown>, submitType: MethodCallStrategy | undefined) => Promise<FormSubmitResult>;
