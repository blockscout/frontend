// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AllowanceType, BaseAllowanceType } from '../types';

import { APPROVALS_PAGE_SIZE } from '../constants';

export function getApprovalHiddenKey(record: Pick<BaseAllowanceType | AllowanceType, 'type' | 'address' | 'spender' | 'tokenId'>): string {
  const tokenAddress = record.address.toLowerCase();

  if (record.type !== 'ERC-20' && record.tokenId) {
    return `${ record.type }:${ tokenAddress }:${ record.tokenId }`;
  }

  return `${ record.type }:${ tokenAddress }:${ record.spender.toLowerCase() }`;
}

export function filterHiddenBaseAllowances(
  records: Array<BaseAllowanceType>,
  hiddenApprovalKeys: Array<string>,
): Array<BaseAllowanceType> {
  const hiddenKeys = new Set(hiddenApprovalKeys);

  return records.filter((record) => !hiddenKeys.has(getApprovalHiddenKey(record)));
}

export function getPageBaseAllowances(records: Array<BaseAllowanceType>, page: number): Array<BaseAllowanceType> {
  return records.slice((page - 1) * APPROVALS_PAGE_SIZE, page * APPROVALS_PAGE_SIZE);
}

export function getTotalValueAtRiskUsd(records: Array<BaseAllowanceType>): number {
  const maxValues: Record<`0x${ string }`, number> = {};

  records.forEach((item) => {
    const { address, valueAtRiskUsd } = item;

    if (!valueAtRiskUsd) return;

    if (
      maxValues[address] === undefined ||
      valueAtRiskUsd > maxValues[address]
    ) {
      maxValues[address] = valueAtRiskUsd;
    }
  });

  return Object.values(maxValues).reduce((sum, val) => sum + val, 0);
}
