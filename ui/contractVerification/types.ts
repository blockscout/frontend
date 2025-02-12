import type { SmartContractLicenseType } from 'types/api/contract';
import type { SmartContractVerificationMethod } from 'types/client/contract';
import type { Option } from 'ui/shared/forms/inputs/select/types';

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

interface FormFieldsBase {
  address: string;
  method: MethodOption;
  license_type: LicenseOption | null;
}

export interface FormFieldsFlattenSourceCode extends FormFieldsBase {
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

export interface FormFieldsStandardInput extends FormFieldsBase {
  name: string;
  compiler: Option | null;
  sources: Array<File>;
  autodetect_constructor_args: boolean;
  constructor_args: string;
}

export interface FormFieldsStandardInputZk extends FormFieldsBase {
  name: string;
  compiler: Option | null;
  zk_compiler: Option | null;
  sources: Array<File>;
  autodetect_constructor_args: boolean;
  constructor_args: string;
}

export interface FormFieldsSourcify extends FormFieldsBase {
  sources: Array<File>;
  contract_index?: Option;
}

export interface FormFieldsMultiPartFile extends FormFieldsBase {
  compiler: Option | null;
  evm_version: Option | null;
  is_optimization_enabled: boolean;
  optimization_runs: string;
  sources: Array<File>;
  libraries: Array<ContractLibrary>;
}

export interface FormFieldsVyperContract extends FormFieldsBase {
  name: string;
  evm_version: Option | null;
  compiler: Option | null;
  code: string;
  constructor_args: string | undefined;
}

export interface FormFieldsVyperMultiPartFile extends FormFieldsBase {
  compiler: Option | null;
  evm_version: Option | null;
  sources: Array<File>;
  interfaces: Array<File>;
}

export interface FormFieldsVyperStandardInput extends FormFieldsBase {
  compiler: Option | null;
  sources: Array<File>;
}

export interface FormFieldsStylusGitHubRepo extends FormFieldsBase {
  compiler: Option | null;
  repository_url: string;
  commit_hash: string;
  path_prefix: string;
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsStandardInputZk | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract | FormFieldsVyperMultiPartFile | FormFieldsVyperStandardInput | FormFieldsStylusGitHubRepo;
