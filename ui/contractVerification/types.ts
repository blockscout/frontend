export type VerificationMethod = 'flatten_source_code' | 'standard_input' | 'sourcify' | 'multi_part_file' | 'vyper_contract'

export interface FormFieldsFlattenSourceCode {
  method: 'flatten_source_code';
}

export interface FormFieldsStandardInput {
  method: 'standard_input';
}

export interface FormFieldsSourcify {
  method: 'sourcify';
}

export interface FormFieldsMultiPartFile {
  method: 'multi_part_file';
}

export interface FormFieldsVyperContract {
  method: 'vyper_contract';
}

export type FormFields = FormFieldsFlattenSourceCode | FormFieldsStandardInput | FormFieldsSourcify |
FormFieldsMultiPartFile | FormFieldsVyperContract;
