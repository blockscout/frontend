import type { BaseAllowanceType } from '../types';

import { describe, expect, it } from 'vitest';

import { getTotalValueAtRiskUsd, getValueAtRiskUsd } from './erc20ValueAtRisk';

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

describe('getValueAtRiskUsd', () => {
  it('supports zero-decimal ERC-20 tokens', () => {
    expect(getValueAtRiskUsd(BigInt(10), {
      balance: BigInt(7),
      exchangeRate: '2',
      decimals: 0,
    })).toBe(14);
  });
});

describe('getTotalValueAtRiskUsd', () => {
  it('sums the highest visible value at risk per token address', () => {
    const records = [
      { ...baseRecord(1), address: '0x1111111111111111111111111111111111111111' as `0x${ string }`, valueAtRiskUsd: 100 },
      { ...baseRecord(2), address: '0x1111111111111111111111111111111111111111' as `0x${ string }`, valueAtRiskUsd: 80 },
      { ...baseRecord(3), address: '0x2222222222222222222222222222222222222222' as `0x${ string }`, valueAtRiskUsd: 50 },
      { ...baseRecord(4), address: '0x3333333333333333333333333333333333333333' as `0x${ string }`, valueAtRiskUsd: undefined },
    ];

    expect(getTotalValueAtRiskUsd(records)).toBe(150);
  });
});
