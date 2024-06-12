import type { AbiFunction } from 'abitype';

import type { SmartContractMethod } from '../types';
import type { SmartContractMethodOutput, SmartContractQueryMethod } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';

// TODO @tom2drum remove these types
export type ContractAbiItemInput = AbiFunction['inputs'][number] & { fieldType?: 'native_coin' };
export type ContractAbiItemOutput = SmartContractMethodOutput;
export type ContractAbiItem = SmartContractMethod;
export type ContractAbi = Array<ContractAbiItem>;

// TODO @tom2drum move this type up to the tree
export type MethodType = 'read' | 'write';
export type MethodCallStrategy = 'wallet_client' | 'public_client';

export interface FormSubmitResultApi {
  source: 'public_client';
  result: SmartContractQueryMethod | ResourceError | Error;
}
export interface FormSubmitResultWalletClient {
  source: 'wallet_client';
  result: Error | { hash: `0x${ string }` | undefined } | undefined;
}
export type FormSubmitResult = FormSubmitResultApi | FormSubmitResultWalletClient;

export type FormSubmitHandler = (item: SmartContractMethod, args: Array<unknown>, submitType: MethodCallStrategy | undefined) => Promise<FormSubmitResult>;
