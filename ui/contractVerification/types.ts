import type { Option } from 'ui/shared/FancySelect/types';

export interface ContractLibrary {
  name: string;
  address: string;
}
export interface FormFieldsFlattenSourceCode {
  method: 'flattened_code';
  is_yul: boolean;
  name: string;
  compiler: Option;
  evm_version: Option;
  is_optimization_enabled: boolean;
  optimization_runs: string;
  code: string;
  constructor_args: boolean;
  libraries: Array<ContractLibrary>;
}

export interface FormFieldsStandardInput {
  method: 'standard_input';
  name: string;
  compiler: Option;
  sources: Array<File>;
}

export interface FormFieldsSourcify {
  method: 'sourcify';
  sources: Array<File>;
}

export interface FormFieldsMultiPartFile {
  method: 'multi_part';
  compiler: Option;
  evm_version: Option;
  is_optimization_enabled: boolean;
  optimization_runs: string;
  sources: Array<File>;
}

export interface FormFieldsVyperContract {
  method: 'vyper_multi_part';
  name: string;
  compiler: Option;
  code: string;
  abi_encoded_args: string;
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract;
