export interface SmartContract {
  deployed_bytecode: string | null;
  creation_bytecode: string | null;
  is_self_destructed: boolean;
  abi: Array<Record<string, unknown>> | null;
  compiler_version: string | null;
  evm_version: string | null;
  optimization_enabled: boolean | null;
  optimization_runs: number | null;
  name: string | null;
  verified_at: string | null;
  is_verified: boolean | null;
  source_code: string | null;
  can_be_visualized_via_sol2uml: boolean | null;
}

export interface SmartContractMethodBase {
  inputs: Array<SmartContractMethodInput>;
  outputs: Array<SmartContractMethodOutput>;
  constant: boolean;
  name: string;
  stateMutability: string;
  type: 'function';
  payable: boolean;
}

export interface SmartContractReadMethod extends SmartContractMethodBase {
  method_id: string;
}

export interface SmartContractWriteFallback {
  payable: true;
  stateMutability: 'payable';
  type: 'fallback';
}

export type SmartContractWriteMethod = SmartContractMethodBase | SmartContractWriteFallback;

export type SmartContractMethod = SmartContractReadMethod | SmartContractWriteMethod;

export interface SmartContractMethodInput {
  internalType: string;
  name: string;
  type: string;
}

export interface SmartContractMethodOutput extends SmartContractMethodInput {
  value?: string;
}
