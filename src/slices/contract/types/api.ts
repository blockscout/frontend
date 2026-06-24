// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Abi, AbiType } from 'abitype';

import type { operations, schemas } from '@blockscout/api-types';

export type SmartContractMethodArgType = AbiType;
export type SmartContractMethodStateMutability = 'view' | 'nonpayable' | 'payable';

export interface SmartContract extends Omit<schemas['SmartContract'], 'abi' | 'decoded_constructor_args'> {
  abi: Abi | null;
  decoded_constructor_args: Array<SmartContractDecodedConstructorArg> | null;
}

export type SmartContractDecodedConstructorArg = [
  unknown,
  {
    internalType: SmartContractMethodArgType;
    name: string;
    type: SmartContractMethodArgType;
  },
];

export type SmartContractExternalLibrary = NonNullable<schemas['SmartContract']['external_libraries']>[number];

// VERIFICATION

export type SmartContractVerificationMethodApi = 'flattened-code' | 'standard-input' | 'sourcify' | 'multi-part' |
'vyper-code' | 'vyper-multi-part' | 'vyper-standard-input' | 'stylus-github-repository';

export interface SmartContractVerificationConfigRaw {
  solidity_compiler_versions: Array<string>;
  solidity_evm_versions: Array<string>;
  verification_options: Array<string>;
  vyper_compiler_versions: Array<string>;
  stylus_compiler_versions?: Array<string>;
  vyper_evm_versions: Array<string>;
  is_rust_verifier_microservice_enabled: boolean;
  license_types: Record<NonNullable<schemas['SmartContract']['license_type']>, number>;
  zk_compiler_versions?: Array<string>;
  zk_optimization_modes?: Array<string>;
}

export type SmartContractVerificationResponse = {
  status: 'error';
  errors: SmartContractVerificationError;
} | {
  status: 'success';
};

export interface SmartContractVerificationError {
  contract_source_code?: Array<string>;
  files?: Array<string>;
  interfaces?: Array<string>;
  compiler_version?: Array<string>;
  constructor_arguments?: Array<string>;
  name?: Array<string>;
}

export type VerifiedContractsFilter = NonNullable<NonNullable<operations['SmartContractController.smart_contracts_list']['params']['query']>['filter']>;

export interface VerifiedContractsFilters {
  q: string | undefined;
  filter: VerifiedContractsFilter | undefined;
}

export interface VerifiedContractsSorting {
  sort: NonNullable<NonNullable<NonNullable<operations['SmartContractController.smart_contracts_list']['params']['query']>['sort']>>;
  order: NonNullable<NonNullable<NonNullable<operations['SmartContractController.smart_contracts_list']['params']['query']>['order']>>;
}

export type VerifiedContractsSortingField = VerifiedContractsSorting['sort'];

export type VerifiedContractsSortingValue = `${ VerifiedContractsSortingField }-${ VerifiedContractsSorting['order'] }` | 'default';
