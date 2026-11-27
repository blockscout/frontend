import { describe, it, expect } from 'vitest';

import { getCurrencyUnits } from './units';

describe('getCurrencyUnits', () => {
  it('takes every unit name from the currency config', () => {
    expect(getCurrencyUnits({ symbol: 'xDAI', weiName: 'grain', gweiName: 'kilograin' })).toEqual({ ether: 'xDAI', wei: 'grain', gwei: 'kilograin' });
  });

  it('derives the gwei name from the wei name when it is not configured', () => {
    expect(getCurrencyUnits({ symbol: 'xDAI', weiName: 'Grain', gweiName: undefined }).gwei).toBe('GGrain');
  });

  it('falls back to the Ethereum unit names when nothing is configured', () => {
    expect(getCurrencyUnits({ symbol: undefined, weiName: undefined, gweiName: undefined })).toEqual({ ether: 'ETH', wei: 'wei', gwei: 'Gwei' });
  });
});
