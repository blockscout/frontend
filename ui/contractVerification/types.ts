export type VerificationMethod = 'flatten_source_code' | 'standard_input' | 'sourcify' | 'multi_part_file' | 'vyper_contract'

export interface ContractLibrary {
  name: string;
  address: string;
}
export interface FormFieldsFlattenSourceCode {
  method: 'flatten_source_code';
  is_yul: boolean;
  name: string;
  compiler: string;
  evm_version: string;
  is_optimization_enabled: boolean;
  optimization_runs: string;
  code: string;
  constructor_args: boolean;
  libraries: Array<ContractLibrary>;
}

export interface FormFieldsStandardInput {
  method: 'standard_input';
  name: string;
  compiler: string;
  sources: Array<File>;
}

export interface FormFieldsSourcify {
  method: 'sourcify';
}

export interface FormFieldsMultiPartFile {
  method: 'multi_part_file';
  compiler: string;
  evm_version: string;
  is_optimization_enabled: boolean;
  optimization_runs: string;
  sources: Array<File>;
}

export interface FormFieldsVyperContract {
  method: 'vyper_contract';
  name: string;
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract;
