import BigNumber from 'bignumber.js';

import config from 'configs/app/config';

export const getNativeCoinValue = (value: string | Array<string>) => {
  const _value = Array.isArray(value) ? value[0] : value;
  return BigNumber(_value).times(10 ** config.network.currency.decimals).toString();
};
