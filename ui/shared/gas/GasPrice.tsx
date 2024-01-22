import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { GasPriceInfo } from 'types/api/stats';

type View = 'gwei' | 'usd';
const PRIMARY_VIEW: View = 'usd';

interface Props {
  data: GasPriceInfo | null;
  className?: string;
  unitMode?: 'primary' | 'secondary';
  prefix?: string;
  emptyText?: string;
}

const GasPrice = ({ data, prefix, className, unitMode = 'primary', emptyText }: Props) => {
  if (!data) {
    return emptyText ? <span>emptyText</span> : null;
  }

  const view = (() => {
    if (unitMode === 'primary') {
      return PRIMARY_VIEW;
    }

    return PRIMARY_VIEW === 'usd' ? 'gwei' : 'usd';
  })();

  if (view === 'usd' && data.fiat_price) {
    return (
      <span className={ className }>
        { prefix }${ Number(data.fiat_price).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
      </span>
    );
  }

  if (!data.price) {
    return emptyText ? <span>emptyText</span> : null;
  }

  return <span className={ className }>{ prefix }{ data.price } Gwei</span>;
};

export default chakra(GasPrice);
