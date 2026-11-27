// SPDX-License-Identifier: LicenseRef-Blockscout

import type config from 'src/config';
import type { Unit } from 'src/shared/values/entity/utils';

export type CurrencyUnits = Readonly<Record<Unit, string>>;

type CurrencyConfig = Pick<typeof config.chain.currency, 'symbol' | 'weiName' | 'gweiName'>;

// In a React tree use `useCurrencyUnits`, which follows the chain of a multichain view.
export function getCurrencyUnits(currency: CurrencyConfig): CurrencyUnits {
  const weiName = currency.weiName || 'wei';

  return {
    wei: weiName,
    gwei: currency.gweiName || `G${ weiName }`,
    ether: currency.symbol || 'ETH',
  };
}
