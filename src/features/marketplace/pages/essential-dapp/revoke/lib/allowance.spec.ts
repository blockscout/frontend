import { describe, expect, it } from 'vitest';

import { shouldKeepErc20Allowance } from './allowance';

describe('shouldKeepErc20Allowance', () => {
  it('filters zero and missing allowances before enrichment', () => {
    expect(shouldKeepErc20Allowance(undefined)).toBe(false);
    expect(shouldKeepErc20Allowance(BigInt(0))).toBe(false);
    expect(shouldKeepErc20Allowance(BigInt(1))).toBe(true);
  });
});
