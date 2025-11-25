import BigNumber from 'bignumber.js';

import config from 'configs/app';
import { ZERO } from 'toolkit/utils/consts';
import { thinsp } from 'toolkit/utils/htmlEntities';

interface FormatBnValueParams {
  value: BigNumber;
  accuracy?: number;
  prefix?: string;
  postfix?: string;
  overflowed?: boolean;
}

export const formatBnValue = ({ value, accuracy, prefix, postfix, overflowed }: FormatBnValueParams) => {
  const fullPrefix = `${ overflowed ? `>${ thinsp }` : '' }${ prefix ?? '' }`;

  if (!accuracy) {
    return `${ fullPrefix }${ value.toFormat() }${ postfix ?? '' }`;
  }

  const formattedValue = value.dp(accuracy).toFormat();

  return formattedValue === '0' && !value.isEqualTo(ZERO) && !overflowed ?
    `<${ thinsp }${ prefix ?? '' }0.${ '0'.repeat(accuracy - 1) }1${ postfix ?? '' }` :
    `${ fullPrefix }${ formattedValue }${ postfix ?? '' }`;
};

export const DEFAULT_ACCURACY = 8;
export const DEFAULT_ACCURACY_USD = 2;

export const WEI_DECIMALS = config.chain.currency.decimals;
// maybe we need to add customization for gwei decimals as well
export const GWEI_DECIMALS = 9;

export const WEI = new BigNumber(10 ** WEI_DECIMALS);
export const GWEI = new BigNumber(10 ** GWEI_DECIMALS);
