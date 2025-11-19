import type { Unit } from 'types/unit';

import config from 'configs/app';

const weiName = config.chain.currency.weiName || 'wei';
const gweiName = config.chain.currency.gweiName || `G${ weiName }`;

export const currencyUnits: Record<Unit, string> = {
  wei: weiName,
  gwei: gweiName,
  ether: config.chain.currency.symbol || 'ETH',
};
