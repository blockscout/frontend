// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type { Unit } from 'client/shared/values/entity/utils';

const weiName = config.chain.currency.weiName || 'wei';
const gweiName = config.chain.currency.gweiName || `G${ weiName }`;

export const currencyUnits: Record<Unit, string> = {
  wei: weiName,
  gwei: gweiName,
  ether: config.chain.currency.symbol || 'ETH',
};
