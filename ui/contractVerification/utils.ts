import type { SmartContractVerificationMethod } from 'types/api/contract';

export const SUPPORTED_VERIFICATION_METHODS: Array<SmartContractVerificationMethod> = [
  'flattened_code',
  'standard_input',
  'sourcify',
  'multi_part',
  'vyper_multi_part',
];

export function isValidVerificationMethod(method?: string): method is SmartContractVerificationMethod {
  return method && SUPPORTED_VERIFICATION_METHODS.includes(method as SmartContractVerificationMethod) ? true : false;
}
