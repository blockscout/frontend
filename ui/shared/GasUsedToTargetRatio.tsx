import { Stat, StatArrow, Text, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  used: number;
  target: number;
  className?: string;
}

const GasUsedToTargetRatio = ({ used, target, className }: Props) => {
  const percentage = (used / target - 1) * 100;

  return (
    <Stat className={ className }>
      <StatArrow type={ percentage >= 0 ? 'increase' : 'decrease' }/>
      <Text as="span" color={ percentage >= 0 ? 'green.500' : 'red.500' } fontWeight={ 600 }>
        { Math.abs(percentage).toLocaleString('en', { maximumFractionDigits: 2 }) } %
      </Text>
    </Stat>
  );
};

export default React.memo(chakra(GasUsedToTargetRatio));
