// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AllowanceType } from '../types';

export default function formatAllowance(approval: AllowanceType) {
  if (approval.type !== 'ERC-20' && approval.tokenId) {
    return `Token #${ approval.tokenId }`;
  }

  if (!approval.allowance) return 'N/A';
  if (approval.allowance === 'Unlimited') return 'Unlimited';

  const allowance = parseFloat(approval.allowance);
  return Number(
    allowance >= 1 ? allowance.toFixed(2) : allowance.toPrecision(2),
  ).toString();
}

export function getAllowancePostfix(approval: AllowanceType, formattedAllowance: string) {
  if (approval.type !== 'ERC-20') return undefined;

  return [ 'Unlimited', 'N/A' ].includes(formattedAllowance) ? undefined : approval.symbol;
}
