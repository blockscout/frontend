import type { AbiFunction, AbiFallback, AbiReceive } from 'abitype';

export type ContractAbiItemInput = AbiFunction['inputs'][number] & { fieldType?: 'native_coin' };

export type MethodType = 'read' | 'write';
export type MethodCallStrategy = 'read' | 'write' | 'simulate';
export type ResultViewMode = 'preview' | 'result';

export type SmartContractMethodRead = AbiFunction & { method_id: string };
export type SmartContractMethodWrite = AbiFunction & { method_id: string } | AbiFallback | AbiReceive;
export type SmartContractMethod = SmartContractMethodRead | SmartContractMethodWrite;

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
