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
}
