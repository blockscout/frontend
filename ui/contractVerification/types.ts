import type { SmartContractLicenseType } from 'types/api/contract';
import type { SmartContractVerificationMethod } from 'types/client/contract';
import type { Option } from 'ui/shared/FancySelect/types';

export interface ContractLibrary {
  name: string;
  address: string;
}

interface MethodOption {
  label: string;
  value: SmartContractVerificationMethod;
}

export interface LicenseOption {
  label: string;
  value: SmartContractLicenseType;
}

export interface FormFieldsFlattenSourceCode {
  address: string;
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
  license_type: LicenseOption | null;
}

export interface FormFieldsStandardInput {
  address: string;
  method: MethodOption;
  name: string;
  compiler: Option | null;
  sources: Array<File>;
  autodetect_constructor_args: boolean;
  constructor_args: string;
  license_type: LicenseOption | null;
}

export interface FormFieldsStandardInputZk {
  address: string;
  method: MethodOption;
  name: string;
  compiler: Option | null;
  zk_compiler: Option | null;
  sources: Array<File>;
  autodetect_constructor_args: boolean;
  constructor_args: string;
  license_type: LicenseOption | null;
}

export interface FormFieldsSourcify {
  address: string;
  method: MethodOption;
  sources: Array<File>;
  contract_index?: Option;
  license_type: LicenseOption | null;
}

export interface FormFieldsMultiPartFile {
  address: string;
  method: MethodOption;
  compiler: Option | null;
  evm_version: Option | null;
  is_optimization_enabled: boolean;
  optimization_runs: string;
  sources: Array<File>;
  libraries: Array<ContractLibrary>;
  license_type: LicenseOption | null;
}

export interface FormFieldsVyperContract {
  address: string;
  method: MethodOption;
  name: string;
  evm_version: Option | null;
  compiler: Option | null;
  code: string;
  constructor_args: string | undefined;
  license_type: LicenseOption | null;
}

export interface FormFieldsVyperMultiPartFile {
  address: string;
  method: MethodOption;
  compiler: Option | null;
  evm_version: Option | null;
  sources: Array<File>;
  interfaces: Array<File>;
  license_type: LicenseOption | null;
}

export interface FormFieldsVyperStandardInput {
  address: string;
  method: MethodOption;
  compiler: Option | null;
  sources: Array<File>;
  license_type: LicenseOption | null;
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsStandardInputZk | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract | FormFieldsVyperMultiPartFile | FormFieldsVyperStandardInput;
