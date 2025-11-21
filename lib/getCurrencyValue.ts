import BigNumber from 'bignumber.js';

import { ZERO } from 'toolkit/utils/consts';

interface Params {
  value: string;
  exchangeRate?: string | null;
  accuracy?: number;
  accuracyUsd?: number;
  decimals?: string | null;
}

// TODO @tom2drum remove this function
export default function getCurrencyValue({ value, accuracy, accuracyUsd, decimals, exchangeRate }: Params) {
  const valueBn = BigNumber(value);
  const valueCurr = valueBn.div(BigNumber(10 ** Number(decimals || '18')));

  const valueStr = (() => {
    if (!accuracy) {
      return valueCurr.toFormat();
    }
    const formattedValue = valueCurr.dp(accuracy).toFormat();
    return formattedValue === '0' && !valueBn.isEqualTo(ZERO) ? `< 0.${ '0'.repeat(accuracy - 1) }1` : formattedValue;
  })();

  let usdResult: string | undefined;
  let usdBn = ZERO;

  if (exchangeRate) {
    const exchangeRateBn = new BigNumber(exchangeRate);
    usdBn = valueCurr.times(exchangeRateBn);
    if (accuracyUsd && !usdBn.isEqualTo(0)) {
      const usdBnDp = usdBn.dp(accuracyUsd);
      usdResult = usdBnDp.isEqualTo(0) ? usdBn.precision(accuracyUsd).toFormat() : usdBnDp.toFormat();
    } else {
      usdResult = usdBn.toFormat();
    }
  }

  return { valueCurr, valueStr, usd: usdResult, usdBn };
}
