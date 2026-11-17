// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';

const THOUSAND = 1_000;
const MILLION = 1_000 * THOUSAND;

// Below this a two-decimal format would collapse to `0.00`, so significant digits are used instead.
const SMALL_VALUE_THRESHOLD = 0.1;
const SIGNIFICANT_DIGITS = 2;
const DECIMAL_PLACES = 2;
const THOUSANDS_THRESHOLD = 10 * THOUSAND;

// Shared by the interpretation component and its plain-text renderer so an amount in a social preview
// reads exactly as it does on the page.
export default function formatCurrencyValue(value: string) {
  const amount = BigNumber(value);

  if (amount.isLessThan(SMALL_VALUE_THRESHOLD)) {
    return amount.toPrecision(SIGNIFICANT_DIGITS);
  }

  if (amount.isLessThan(THOUSANDS_THRESHOLD)) {
    return amount.dp(DECIMAL_PLACES).toFormat();
  }

  if (amount.isLessThan(MILLION)) {
    return amount.dividedBy(THOUSAND).toFormat(DECIMAL_PLACES) + 'K';
  }

  return amount.dividedBy(MILLION).toFormat(DECIMAL_PLACES) + 'M';
}
