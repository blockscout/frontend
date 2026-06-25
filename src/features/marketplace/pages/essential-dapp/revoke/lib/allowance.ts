// SPDX-License-Identifier: LicenseRef-Blockscout

export function shouldKeepErc20Allowance(allowance: bigint | undefined): allowance is bigint {
  return Boolean(allowance && allowance !== BigInt(0));
}
