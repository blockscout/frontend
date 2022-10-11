import BigNumber from 'bignumber.js';

export const WEI = new BigNumber(10 ** 18);
export const GWEI = new BigNumber(10 ** 9);
export const WEI_IN_GWEI = WEI.dividedBy(GWEI);
