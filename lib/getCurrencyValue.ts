import BigNumber from 'bignumber.js';

import { ZERO } from 'toolkit/utils/consts';

interface Params {
  value: string;
  exchangeRate?: string | null;
  accuracy?: number;
  accuracyUsd?: number;
  decimals?: string | null;
}

export default function getCurrencyValue({ value, accuracy, accuracyUsd, decimals, exchangeRate }: Params) {
  const valueCurr = BigNumber(value).div(BigNumber(10 ** Number(decimals || '18')));
  const valueResult = accuracy ? valueCurr.dp(accuracy).toFormat() : valueCurr.toFormat();

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

  return { valueStr: valueResult, usd: usdResult, usdBn };
}
