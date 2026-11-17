import { it, expect, describe } from 'vitest';

import formatCurrencyValue from './format-currency-value';

describe('picks the notation by magnitude', () => {
  it.each([
    // significant digits below 0.1, where two decimal places would collapse to 0.00
    [ '0.015575428823202624', '0.016' ],
    [ '0.09999', '0.10' ],
    // two decimal places up to 10K, so a value rounding up to the threshold still gets them
    [ '0.1', '0.1' ],
    [ '9999.999', '10,000' ],
    // thousands and millions
    [ '10000', '10.00K' ],
    [ '999999', '1,000.00K' ],
    [ '1000000', '1.00M' ],
    [ '2918443.532640630294962772', '2.92M' ],
  ])('%s → %s', (value, expected) => {
    expect(formatCurrencyValue(value)).toBe(expected);
  });
});
