import type { Abi } from 'abitype';

export interface SmartContract {
  deployed_bytecode: string | null;
  creation_bytecode: string | null;
  is_self_destructed: boolean;
  abi: Abi | null;
  compiler_version: string | null;
  evm_version: string | null;
  optimization_enabled: boolean | null;
  optimization_runs: number | null;
  name: string | null;
  verified_at: string | null;
  is_verified: boolean | null;
  source_code: string | null;
  constructor_args: string | null;
  can_be_visualized_via_sol2uml: boolean | null;
  is_vyper_contract: boolean | null;
}

export interface SmartContractMethodBase {
  inputs: Array<SmartContractMethodInput>;
  outputs: Array<SmartContractMethodOutput>;
  constant: boolean;
  name: string;
  stateMutability: 'view' | 'nonpayable' | 'payable';
  type: 'function';
  payable: boolean;
  error?: string;
}

export interface SmartContractReadMethod extends SmartContractMethodBase {
  method_id: string;
}

export interface SmartContractWriteFallback {
  stateMutability: 'payable';
  type: 'fallback';
}

export interface SmartContractWriteReceive {
  stateMutability: 'payable';
  type: 'receive';
}

export type SmartContractWriteMethod = SmartContractMethodBase | SmartContractWriteFallback | SmartContractWriteReceive;

export type SmartContractMethod = SmartContractReadMethod | SmartContractWriteMethod;

export interface SmartContractMethodInput {
  internalType: string;
  name: string;
  type: 'address' | 'uint256' | 'bool';
}

export interface SmartContractMethodOutput extends SmartContractMethodInput {
  value?: string;
}

export interface SmartContractQueryMethodReadSuccess {
  is_error: false;
  result: {
    names: Array<string>;
    output: Array<{
      type: string;
      value: string;
    }>;
  };
}

export interface SmartContractQueryMethodReadError {
  is_error: true;
  result: {
    code: number;
    message: string;
    raw?: string;
  } | {
    error: string;
  };
}

export type SmartContractQueryMethodRead = SmartContractQueryMethodReadSuccess | SmartContractQueryMethodReadError;
