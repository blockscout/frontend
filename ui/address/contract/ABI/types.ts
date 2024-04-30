import type { AbiFallback, AbiFunction, AbiReceive } from 'abitype';

import type { SmartContractQueryMethod, SmartContractMethod, SmartContractReadMethod } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';

export type MethodFormFields = Record<string, string | Array<string>>;
export type MethodFormFieldsFormatted = Record<string, MethodArgType>;

export type MethodArgType = string | boolean | Array<MethodArgType>;

export type ContractMethodReadResult = SmartContractQueryMethod | ResourceError;

export type ContractMethodWriteResult = Error | { hash: `0x${ string }` | undefined } | undefined;

export type ContractMethodCallResult<T extends SmartContractMethod> =
    T extends SmartContractReadMethod ? ContractMethodReadResult : ContractMethodWriteResult;

// ++++++++++++++++

export type ContractAbiItem = AbiFallback | (AbiFunction & { method_id: string }) | AbiReceive;
export type ContractAbiItemInput = AbiFunction['inputs'][number] & { fieldType?: 'native_coin' };
export type ContractAbiItemOutput = AbiFunction['outputs'][number] & { value?: string | boolean | object };
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
