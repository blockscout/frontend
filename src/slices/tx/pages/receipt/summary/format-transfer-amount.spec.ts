import { describe, it, expect } from 'vitest';

import { formatTransferAmount } from './format-transfer-amount';

describe('formatTransferAmount', () => {
  it('shows zero as a bare zero', () => {
    expect(formatTransferAmount('0')).toBe('0');
  });

  it('rounds an amount to two decimal places, as the transaction interpretation does', () => {
    expect(formatTransferAmount('134.168381')).toBe('134.17');
  });

  it('keeps two significant digits of a small amount', () => {
    expect(formatTransferAmount('0.008249689656745026')).toBe('0.0082');
  });

  it('shortens a large amount', () => {
    expect(formatTransferAmount('12345.6')).toBe('12.35K');
  });
});
