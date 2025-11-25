import BigNumber from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { thinsp } from 'toolkit/utils/htmlEntities';

import type { Props as AssetValueProps } from './AssetValue';
import AssetValue from './AssetValue';
import { GWEI, GWEI_DECIMALS } from './utils';

export interface Props extends AssetValueProps {
  units?: 'wei' | 'gwei' | 'ether';
  noSymbol?: boolean;
  // if value is greater than 10 ^ gweiThreshold and unit are wei, gwei units will be used for better formatting
  gweiThreshold?: number;
  // for the main value element show tooltip with value in gwei
  gweiTooltip?: boolean;
}

const NativeCoinValue = ({
  amount,
  asset: assetProp,
  units: unitsProp = 'ether',
  noSymbol,
  loading,
  gweiThreshold,
  accuracy,
  gweiTooltip,
  noTooltip,
  ...rest
}: Props) => {

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
      if (assetProp) {
        return assetProp;
      }

      switch (units) {
        case 'wei':
          return currencyUnits.wei;
        case 'gwei':
          return currencyUnits.gwei;
        case 'ether':
          return currencyUnits.ether;
      }
    }
  }, [ assetProp, noSymbol, units ]);

  const tooltipContent = React.useMemo(() => {
    if (gweiTooltip) {
      return `${ BigNumber(amount || 0).div(GWEI).toFormat() }${ thinsp }${ currencyUnits.gwei }`;
    }
  }, [ gweiTooltip, amount ]);

  return (
    <AssetValue
      amount={ amount }
      decimals={ decimals }
      asset={ asset }
      loading={ loading }
      accuracy={ unitsProp === 'wei' && units === 'gwei' && gweiThreshold ? gweiThreshold : accuracy }
      tooltipContent={ tooltipContent }
      noTooltip={ tooltipContent ? false : noTooltip }
      { ...rest }
    />
  );
};

export default React.memo(NativeCoinValue);
