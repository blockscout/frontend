import type { SmartContractVerificationMethod } from 'types/api/contract';
import type { Option } from 'ui/shared/FancySelect/types';

export interface ContractLibrary {
  name: string;
  address: string;
}

interface MethodOption {
  label: string;
  value: SmartContractVerificationMethod;
}

export interface FormFieldsFlattenSourceCode {
  method: MethodOption;
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
  method: MethodOption;
  name: string;
  compiler: Option;
  sources: Array<File>;
  autodetect_constructor_args: boolean;
  constructor_args: string;
}

export interface FormFieldsSourcify {
  method: MethodOption;
  sources: Array<File>;
}

export interface FormFieldsMultiPartFile {
  method: MethodOption;
  compiler: Option;
  evm_version: Option;
  is_optimization_enabled: boolean;
  optimization_runs: string;
  sources: Array<File>;
  libraries: Array<ContractLibrary>;
}

export interface FormFieldsVyperContract {
  method: MethodOption;
  name: string;
  compiler: Option;
  code: string;
  constructor_args: string;
}

export interface FormFieldsVyperMultiPartFile {
  method: MethodOption;
  compiler: Option;
  evm_version: Option;
  sources: Array<File>;
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract | FormFieldsVyperMultiPartFile;
