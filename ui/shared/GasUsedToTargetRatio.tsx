import { Stat, StatArrow, Text, chakra } from '@chakra-ui/react';
import React from 'react';

type Props = ({
  value: number;
} | {
  used: number;
  target: number;
}) & {
  className?: string;
}

const GasUsedToTargetRatio = (props: Props) => {
  const percentage = (() => {
    if ('value' in props) {
      return props.value;
    }

    return (props.used / props.target - 1) * 100;
  })();

  return (
    <Stat className={ props.className }>
      <StatArrow type={ percentage >= 0 ? 'increase' : 'decrease' }/>
      <Text as="span" color={ percentage >= 0 ? 'green.500' : 'red.500' } fontWeight={ 600 }>
        { Math.abs(percentage).toLocaleString('en', { maximumFractionDigits: 2 }) } %
      </Text>
    </Stat>
  );
};

export default React.memo(chakra(GasUsedToTargetRatio));
