// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AbiFunction, AbiFallback as AbiFallbackViem, AbiReceive } from 'abitype';
import type { AbiParameter, AbiStateMutability } from 'viem';

export type ContractAbiItemInput = AbiFunction['inputs'][number] & { fieldType?: 'native_coin' };

export type MethodType = 'read' | 'write' | 'all';
export type MethodCallStrategy = 'read' | 'write' | 'simulate' | 'copy_calldata';
export type ResultViewMode = 'preview' | 'result';

// viem's fallback type has no inputs and outputs, and allows only the 'payable' or 'nonpayable' state mutability,
// but the fallback method of any contract can take them, and acts as a read method when its state mutability is 'view'
export interface AbiFallback extends Pick<AbiFallbackViem, 'type' | 'payable'> {
  inputs: Array<AbiParameter>;
  outputs: Array<AbiParameter>;
  stateMutability: Exclude<AbiStateMutability, 'pure'>;
}

export type SmartContractMethodCustomFields = { method_id: string } | { is_invalid: boolean };
export type SmartContractMethodRead = AbiFunction & SmartContractMethodCustomFields;
export type SmartContractMethodWrite = AbiFunction & SmartContractMethodCustomFields | AbiFallback | AbiReceive;
export type SmartContractMethod = SmartContractMethodRead | SmartContractMethodWrite;

export interface FormSubmitResultPublicClient {
  source: 'public_client';
  data: unknown | Error;
  estimatedGas?: bigint;
}
export interface FormSubmitResultWalletClient {
  source: 'wallet_client';
  data: { hash: `0x${ string }` } | Error;
}
export type FormSubmitResult = FormSubmitResultPublicClient | FormSubmitResultWalletClient;

export type FormSubmitHandler = (item: SmartContractMethod, args: Array<unknown>, submitType: MethodCallStrategy | undefined) => Promise<FormSubmitResult>;
