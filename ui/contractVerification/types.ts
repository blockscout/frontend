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
  autodetect_constructor_args: boolean;
  constructor_args: string;
  libraries: Array<ContractLibrary>;
}

export interface FormFieldsStandardInput {
  method: 'standard_input';
  name: string;
  compiler: Option;
  sources: Array<File>;
  autodetect_constructor_args: boolean;
  constructor_args: string;
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
  libraries: Array<ContractLibrary>;
}

export interface FormFieldsVyperContract {
  method: 'vyper_code';
  name: string;
  compiler: Option;
  code: string;
  constructor_args: string;
}

export interface FormFieldsVyperMultiPartFile {
  method: 'vyper_multi_part';
  compiler: Option;
  evm_version: Option;
  sources: Array<File>;
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract | FormFieldsVyperMultiPartFile;
