import BigNumber from 'bignumber.js';

import { describe, expect, it } from 'vitest';

import calculateUsdValue from './calculateUsdValue';

const ONE_THOUSAND_TOKENS = '1000000000000000000000';
const DECIMALS = '18';
const EXCHANGE_RATE = '2';
const MULTIPLIER = new BigNumber('1.69');

describe('calculateUsdValue', () => {
  describe('with a multiplier', () => {
    const result = calculateUsdValue({ amount: ONE_THOUSAND_TOKENS, decimals: DECIMALS, exchangeRate: EXCHANGE_RATE, multiplier: MULTIPLIER });

    it('scales the displayed value', () => {
      expect(result.valueBn.toFixed()).toBe('1690');
      expect(result.valueStr).toBe('1,690');
    });

    it('keeps the raw value reachable', () => {
      expect(result.rawValueBn.toFixed()).toBe('1000');
    });

    it('computes USD from the scaled value', () => {
      expect(result.usdBn.toFixed()).toBe('3380');
      expect(result.usdStr).toBe('3,380');
    });
  });

  describe('without a multiplier', () => {
    it.each([ undefined, null ])('renders the raw value as is (multiplier: %s)', (multiplier) => {
      const result = calculateUsdValue({ amount: ONE_THOUSAND_TOKENS, decimals: DECIMALS, exchangeRate: EXCHANGE_RATE, multiplier });

      expect(result.valueBn.toFixed()).toBe('1000');
      expect(result.valueStr).toBe('1,000');
      expect(result.rawValueBn.isEqualTo(result.valueBn)).toBe(true);
      expect(result.usdStr).toBe('2,000');
    });
  });
});
