// SPDX-License-Identifier: LicenseRef-Blockscout

// maybe it depends on the network??

export const TRANSACTION_HASH_REGEXP = /^0x[a-fA-F\d]{64}$/;

export const TRANSACTION_HASH_LENGTH = 66;

export function transactionHashValidator(value: string | undefined) {
  if (!value) {
    return true;
  }

  return TRANSACTION_HASH_REGEXP.test(value) ? true : 'Incorrect format';
}
