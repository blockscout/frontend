export type VerificationMethod = 'flatten_source_code' | 'standard_input' | 'sourcify' | 'multi_part_file' | 'vyper_contract'

export interface FormFieldsFlattenSourceCode {
  method: 'flatten_source_code';
  is_yul: boolean;
  name: string;
}

export interface FormFieldsStandardInput {
  method: 'standard_input';
  name: string;
}

export interface FormFieldsSourcify {
  method: 'sourcify';
}

export interface FormFieldsMultiPartFile {
  method: 'multi_part_file';
}

export interface FormFieldsVyperContract {
  method: 'vyper_contract';
  name: string;
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract;
