// SPDX-License-Identifier: LicenseRef-Blockscout

export const SMART_CONTRACT_EXTRA_VERIFICATION_METHODS = [
  'solidity-hardhat' as const,
  'solidity-foundry' as const,
];

export type SmartContractVerificationMethodExtra = (typeof SMART_CONTRACT_EXTRA_VERIFICATION_METHODS)[number];

export interface ContractCodeIde {
  title: string;
  url: string;
  icon_url: string;
}
