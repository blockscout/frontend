import { chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

interface Props {
  data: number | null;
  className?: string;
  unitMode?: 'primary' | 'secondary';
  prefix?: string;
}

const GasPrice = ({ data, prefix, className }: Props) => {
  return (
    <span className={ className }>
      { prefix }
      { data ? BigNumber(data.toFixed(2)).toFormat() : 'N/A' }
    </span>
  );
};

export default chakra(GasPrice);
