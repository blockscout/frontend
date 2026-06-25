import type { BaseAllowanceType } from '../types';

import { describe, expect, it } from 'vitest';

import {
  filterHiddenBaseAllowances,
  getApprovalHiddenKey,
  getPageBaseAllowances,
} from './approvalKeys';

const spender = '0x2222222222222222222222222222222222222222' as `0x${ string }`;

function baseRecord(index: number): BaseAllowanceType {
  return {
    type: 'ERC-20',
    address: `0x${ index.toString(16).padStart(40, '0') }` as `0x${ string }`,
    spender,
    allowance: BigInt(index),
    transactionId: null,
    blockNumber: BigInt(index),
    valueAtRiskUsd: index,
  };
}

describe('approvalKeys', () => {
  it('uses stable hidden keys for ERC-20, limited NFT and unlimited NFT approvals', () => {
    expect(getApprovalHiddenKey({
      type: 'ERC-20',
      address: '0x1111111111111111111111111111111111111111',
      spender,
    })).toBe(`ERC-20:0x1111111111111111111111111111111111111111:${ spender }`);

    expect(getApprovalHiddenKey({
      type: 'ERC-721',
      address: '0x1111111111111111111111111111111111111111',
      spender,
      tokenId: '42',
    })).toBe('ERC-721:0x1111111111111111111111111111111111111111:42');

    expect(getApprovalHiddenKey({
      type: 'ERC-721',
      address: '0x1111111111111111111111111111111111111111',
      spender,
    })).toBe(`ERC-721:0x1111111111111111111111111111111111111111:${ spender }`);
  });

  it('filters hidden base records before slicing so the next approval fills the page', () => {
    const records = Array.from({ length: 51 }, (_, index) => baseRecord(index + 1));
    const hiddenKey = getApprovalHiddenKey(records[0] as BaseAllowanceType);
    const visibleRecords = filterHiddenBaseAllowances(records, [ hiddenKey ]);

    expect(visibleRecords).toHaveLength(50);
    expect(getPageBaseAllowances(visibleRecords, 1).map((record) => record.address)).toEqual(records.slice(1).map((record) => record.address));
  });

});
