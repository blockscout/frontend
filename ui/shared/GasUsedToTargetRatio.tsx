import { Text, Tooltip } from '@chakra-ui/react';
import React from 'react';

type Props = {
  value: number;
}

const GasUsedToTargetRatio = ({ value }: Props) => {
  return (
    <Tooltip label="% of Gas Target">
      <Text variant="secondary">
        { (value > 0 ? '+' : '') + value.toLocaleString(undefined, { maximumFractionDigits: 2 }) }%
      </Text>
    </Tooltip>
  );
};

export default React.memo(GasUsedToTargetRatio);
