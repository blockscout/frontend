// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ContractCodeIde, SmartContractVerificationMethodExtra } from 'client/slices/contract/types/config';
import { SMART_CONTRACT_EXTRA_VERIFICATION_METHODS } from 'client/slices/contract/types/config';

import { getEnvValue, parseEnvJson } from 'client/config/utils/envs';

const extraVerificationMethods: Array<SmartContractVerificationMethodExtra> = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS');
  if (envValue === 'none') {
    return [];
  }

  if (!envValue) {
    return SMART_CONTRACT_EXTRA_VERIFICATION_METHODS;
  }

  const parsedMethods = parseEnvJson<Array<SmartContractVerificationMethodExtra>>(envValue) || [];

  return parsedMethods.filter((method) => SMART_CONTRACT_EXTRA_VERIFICATION_METHODS.includes(method));
})();

const config = Object.freeze({
  solidityscanEnabled: getEnvValue('NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED') === 'true',
  extraVerificationMethods,
  decodedBytecodeEnabled: getEnvValue('NEXT_PUBLIC_VIEWS_CONTRACT_DECODED_BYTECODE_ENABLED') === 'true',
  ides: parseEnvJson<Array<ContractCodeIde>>(getEnvValue('NEXT_PUBLIC_CONTRACT_CODE_IDES')) || [],
  auditReports: getEnvValue('NEXT_PUBLIC_HAS_CONTRACT_AUDIT_REPORTS') === 'true' ? true : false,
});

export default config;
