import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { GasPriceInfo } from 'types/api/stats';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';

const feature = config.features.gasTracker;

interface Props {
  data: GasPriceInfo | null;
  className?: string;
  unitMode?: 'primary' | 'secondary';
  prefix?: string;
  emptyText?: string;
}

const GasPrice = ({ data, prefix, className, unitMode = 'primary', emptyText }: Props) => {
  if (!data || !feature.isEnabled) {
    return emptyText ? <span>emptyText</span> : null;
  }

  const units = (() => {
    if (unitMode === 'primary') {
      return feature.primaryUnits;
    }

    return feature.primaryUnits === 'usd' ? 'gwei' : 'usd';
  })();

  if (units === 'usd' && data.fiat_price) {
    return (
      <span className={ className }>
        { prefix }${ Number(data.fiat_price).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
      </span>
    );
  }

  if (!data.price) {
    return emptyText ? <span>emptyText</span> : null;
  }

  return (
    <span className={ className }>
      { prefix }{ Number(data.price).toLocaleString(undefined, { maximumFractionDigits: 0 }) } { currencyUnits.gwei }
    </span>
  );
};

export default chakra(GasPrice);
