import type { Unit } from 'types/unit';

import config from 'configs/app';

const weiName = config.chain.currency.weiName || 'wei';

export const currencyUnits: Record<Unit, string> = {
  wei: weiName,
  gwei: `G${ weiName }`,
  ether: config.chain.currency.symbol || 'ETH',
};
