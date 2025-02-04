import { chakra } from '@chakra-ui/react';
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
      { data ? data.toFixed(2) : 'N/A' }
    </span>
  );
};

export default chakra(GasPrice);
