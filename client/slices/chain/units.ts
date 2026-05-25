// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Unit } from 'client/shared/values/entity/utils';

import config from 'configs/app';

const weiName = config.chain.currency.weiName || 'wei';
const gweiName = config.chain.currency.gweiName || `G${ weiName }`;

export const currencyUnits: Record<Unit, string> = {
  wei: weiName,
  gwei: gweiName,
  ether: config.chain.currency.symbol || 'ETH',
};
