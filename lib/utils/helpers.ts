import BigNumber from 'bignumber.js';

import { WEI } from 'lib/consts';

export function formatAmount(value: string, decimal = 6) {
  return BigNumber(value).dividedBy(WEI).dp(decimal).toFormat();
}

export function secondToTime(second: number) {
  const times = [];
  let value = second;
  if (value >= 3600) {
    const h = Math.trunc(value / 3600).toString();
    times.push(h.length >= 2 ? h : `0${ h }`);
    value = value - Number(h) * 3600;
  } else {
    times.push('00');
  }

  if (value >= 60) {
    const m = Math.trunc(value / 60).toString();
    times.push(m.length >= 2 ? m : `0${ m }`);
    value = value - Number(m) * 60;
  } else {
    times.push('00');
  }

  times.push(value.toString().length >= 2 ? value : `0${ value }`);

  return times.join(':');
}
