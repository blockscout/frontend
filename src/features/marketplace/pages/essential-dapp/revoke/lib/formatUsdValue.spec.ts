import { describe, expect, it } from 'vitest';

import formatUsdValue from './formatUsdValue';

describe('formatUsdValue', () => {
  it('shows tiny non-zero values as less than one cent', () => {
    expect(formatUsdValue(0.004)).toBe('< $0.01');
  });

  it('formats regular dollar values', () => {
    expect(formatUsdValue(1234.567)).toBe('$1,234.57');
  });

  it('keeps zero explicit', () => {
    expect(formatUsdValue(0)).toBe('$0');
  });
});
