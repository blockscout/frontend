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
  name: string | undefined;
  compiler: Option | null;
  evm_version: Option | null;
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
  compiler: Option | null;
  sources: Array<File>;
  autodetect_constructor_args: boolean;
  constructor_args: string;
}

export interface FormFieldsSourcify {
  method: MethodOption;
  sources: Array<File>;
  contract_index?: Option;
}

export interface FormFieldsMultiPartFile {
  method: MethodOption;
  compiler: Option | null;
  evm_version: Option | null;
  is_optimization_enabled: boolean;
  optimization_runs: string;
  sources: Array<File>;
  libraries: Array<ContractLibrary>;
}

export interface FormFieldsVyperContract {
  method: MethodOption;
  name: string;
  evm_version: Option | null;
  compiler: Option | null;
  code: string;
  constructor_args: string | undefined;
}

export interface FormFieldsVyperMultiPartFile {
  method: MethodOption;
  compiler: Option | null;
  evm_version: Option | null;
  sources: Array<File>;
  interfaces: Array<File>;
}

export interface FormFieldsVyperStandardInput {
  method: MethodOption;
  compiler: Option | null;
  sources: Array<File>;
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract | FormFieldsVyperMultiPartFile | FormFieldsVyperStandardInput;
