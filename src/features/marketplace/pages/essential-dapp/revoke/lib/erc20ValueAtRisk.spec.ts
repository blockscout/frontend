import { describe, expect, it } from 'vitest';

import { getValueAtRiskUsd } from './erc20ValueAtRisk';

describe('getValueAtRiskUsd', () => {
  it('supports zero-decimal ERC-20 tokens', () => {
    expect(getValueAtRiskUsd(BigInt(10), {
      balance: BigInt(7),
      exchangeRate: '2',
      decimals: 0,
    })).toBe(14);
  });
});
