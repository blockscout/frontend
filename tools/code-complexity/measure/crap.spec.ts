import { describe, it, expect } from 'vitest';

import { crapScore } from './crap';

describe('crapScore', () => {
  it('reduces to the complexity when fully covered', () => {
    // cov 1 -> c²·0 + c = c
    expect(crapScore(5, 1)).toBe(5);
  });

  it('is c² + c at zero coverage', () => {
    // cov 0 -> c²·1 + c
    expect(crapScore(5, 0)).toBe(30);
    expect(crapScore(10, 0)).toBe(110);
  });

  it('crosses 30 at complexity 6 with zero coverage but not at 5', () => {
    expect(crapScore(5, 0)).toBe(30); // not > 30
    expect(crapScore(6, 0)).toBe(42); // > 30
  });

  it('scales the coverage gap cubically', () => {
    // c=4, cov=0.5 -> 16·0.125 + 4 = 6
    expect(crapScore(4, 0.5)).toBe(6);
  });
});
