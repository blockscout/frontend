import type { AbiFunction } from 'abitype';

import type { SmartContractMethod } from '../types';

export type ContractAbiItemInput = AbiFunction['inputs'][number] & { fieldType?: 'native_coin' };

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
