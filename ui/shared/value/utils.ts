import type BigNumber from 'bignumber.js';

import { ZERO } from 'toolkit/utils/consts';

interface FormatBnValueParams {
  value: BigNumber;
  accuracy?: number;
  prefix?: string;
  overflowed?: boolean;
}

export const formatBnValue = ({ value, accuracy, prefix, overflowed }: FormatBnValueParams) => {
  const fullPrefix = `${ overflowed ? '> ' : '' }${ prefix ?? '' }`;

  if (!accuracy) {
    return `${ fullPrefix }${ value.toFormat() }`;
  }

  const formattedValue = value.dp(accuracy).toFormat();

  return formattedValue === '0' && !value.isEqualTo(ZERO) && !overflowed ?
    `< ${ prefix }0.${ '0'.repeat(accuracy - 1) }1` :
    `${ fullPrefix }${ formattedValue }`;
};

export const DEFAULT_DECIMALS = '18';
export const DEFAULT_ACCURACY = 8;
export const DEFAULT_ACCURACY_USD = 2;
