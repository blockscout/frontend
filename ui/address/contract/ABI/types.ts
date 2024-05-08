import type { AbiFunction } from 'abitype';

import type { SmartContractMethod, SmartContractMethodOutput, SmartContractQueryMethod } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';

export type ContractAbiItemInput = AbiFunction['inputs'][number] & { fieldType?: 'native_coin' };
export type ContractAbiItemOutput = SmartContractMethodOutput;
export type ContractAbiItem = SmartContractMethod;
export type ContractAbi = Array<ContractAbiItem>;

export type MethodType = 'read' | 'write';
export type MethodCallStrategy = 'api' | 'wallet_client';

export interface FormSubmitResultApi {
  source: 'api';
  result: SmartContractQueryMethod | ResourceError | Error;
}
export interface FormSubmitResultWalletClient {
  source: 'wallet_client';
  result: Error | { hash: `0x${ string }` | undefined } | undefined;
}
export type FormSubmitResult = FormSubmitResultApi | FormSubmitResultWalletClient;

export type FormSubmitHandler = (item: ContractAbiItem, args: Array<unknown>, submitType: MethodCallStrategy | undefined) => Promise<FormSubmitResult>;
