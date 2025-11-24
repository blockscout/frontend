import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';

import type { Props as AssetValueProps } from './AssetValue';
import AssetValue from './AssetValue';
import { GWEI, GWEI_DECIMALS } from './utils';

export interface Props extends AssetValueProps {
  units?: 'wei' | 'gwei' | 'ether';
  noSymbol?: boolean;
  // if value is greater than 10 ^ gweiThreshold and unit are wei, gwei units will be used for better formatting
  gweiThreshold?: number;
}

const NativeCoinValue = ({ amount, asset: assetProp, units: unitsProp = 'ether', noSymbol, loading, gweiThreshold, accuracy, ...rest }: Props) => {

  const units = React.useMemo(() => {
    if (amount && gweiThreshold && unitsProp === 'wei') {
      const valueInGwei = BigNumber(amount).div(GWEI);
      if (valueInGwei.isGreaterThanOrEqualTo(10 ** -gweiThreshold)) {
        return 'gwei';
      }
    }

    return unitsProp;
  }, [ gweiThreshold, unitsProp, amount ]);

  const decimals = (() => {
    if (units === 'wei') {
      return 0;
    }
    if (units === 'gwei') {
      return GWEI_DECIMALS;
    }
    return config.chain.currency.decimals;
  })();

  const asset = React.useMemo(() => {
    if (!noSymbol) {
      switch (units) {
        case 'wei':
          return currencyUnits.wei;
        case 'gwei':
          return currencyUnits.gwei;
        case 'ether':
          return currencyUnits.ether;
        default:
          return assetProp;
      }
    }
  }, [ assetProp, noSymbol, units ]);

  return (
    <AssetValue
      amount={ amount }
      decimals={ decimals }
      asset={ asset }
      loading={ loading }
      accuracy={ unitsProp === 'wei' && units === 'gwei' && gweiThreshold ? gweiThreshold : accuracy }
      { ...rest }
    />
  );
};

export default React.memo(NativeCoinValue);
