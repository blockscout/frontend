import type { Abi, AbiType } from 'abitype';

export type SmartContractMethodArgType = AbiType;
export type SmartContractMethodStateMutability = 'view' | 'nonpayable' | 'payable';

export type SmartContractLicenseType =
'none' |
'unlicense' |
'mit' |
'gnu_gpl_v2' |
'gnu_gpl_v3' |
'gnu_lgpl_v2_1' |
'gnu_lgpl_v3' |
'bsd_2_clause' |
'bsd_3_clause' |
'mpl_2_0' |
'osl_3_0' |
'apache_2_0' |
'gnu_agpl_v3' |
'bsl_1_1';

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
  is_blueprint: boolean | null;
  is_verified: boolean | null;
  is_verified_via_eth_bytecode_db: boolean | null;
  is_changed_bytecode: boolean | null;

  // sourcify info >>>
  is_verified_via_sourcify: boolean | null;
  is_fully_verified: boolean | null;
  is_partially_verified: boolean | null;
  sourcify_repo_url: string | null;
  // <<<<
  source_code: string | null;
  constructor_args: string | null;
  decoded_constructor_args: Array<SmartContractDecodedConstructorArg> | null;
  can_be_visualized_via_sol2uml: boolean | null;
  file_path: string;
  additional_sources: Array<{ file_path: string; source_code: string }>;
  external_libraries: Array<SmartContractExternalLibrary> | null;
  compiler_settings?: {
    evmVersion?: string;
    remappings?: Array<string>;
  };
  verified_twin_address_hash: string | null;
  minimal_proxy_address_hash: string | null;
  language: string | null;
  license_type: SmartContractLicenseType | null;
  certified?: boolean;
}

export type SmartContractDecodedConstructorArg = [
  string,
  {
    internalType: SmartContractMethodArgType;
    name: string;
    type: SmartContractMethodArgType;
  }
]

export interface SmartContractExternalLibrary {
  address_hash: string;
  name: string;
}

// VERIFICATION

export type SmartContractVerificationMethod = 'flattened-code' | 'standard-input' | 'sourcify' | 'multi-part'
| 'vyper-code' | 'vyper-multi-part' | 'vyper-standard-input';

export interface SmartContractVerificationConfigRaw {
  solidity_compiler_versions: Array<string>;
  solidity_evm_versions: Array<string>;
  verification_options: Array<string>;
  vyper_compiler_versions: Array<string>;
  vyper_evm_versions: Array<string>;
  is_rust_verifier_microservice_enabled: boolean;
  license_types: Record<SmartContractLicenseType, number>;
}

export interface SmartContractVerificationConfig extends SmartContractVerificationConfigRaw {
  verification_options: Array<SmartContractVerificationMethod>;
}

export type SmartContractVerificationResponse = {
  status: 'error';
  errors: SmartContractVerificationError;
} | {
  status: 'success';
}

export interface SmartContractVerificationError {
  contract_source_code?: Array<string>;
  files?: Array<string>;
  interfaces?: Array<string>;
  compiler_version?: Array<string>;
  constructor_arguments?: Array<string>;
  name?: Array<string>;
}

export type SolidityscanReport = {
  scan_report: {
    contractname: string;
    scan_status: string;
    scan_summary: {
      issue_severity_distribution: {
        critical: number;
        gas: number;
        high: number;
        informational: number;
        low: number;
        medium: number;
      };
      lines_analyzed_count: number;
      scan_time_taken: number;
      score: string;
      score_v2: string;
      threat_score: string;
    };
    scanner_reference_url: string;
  };
}

type SmartContractSecurityAudit = {
  audit_company_name: string;
  audit_publish_date: string;
  audit_report_url: string;
}

export type SmartContractSecurityAudits = {
  items: Array<SmartContractSecurityAudit>;
}

export type SmartContractSecurityAuditSubmission = {
  'address_hash': string;
  'submitter_name': string;
  'submitter_email': string;
  'is_project_owner': boolean;
  'project_name': string;
  'project_url': string;
  'audit_company_name': string;
  'audit_report_url': string;
  'audit_publish_date': string;
  'comment'?: string;
}
