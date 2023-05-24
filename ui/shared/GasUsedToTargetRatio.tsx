import { Skeleton, Tooltip } from '@chakra-ui/react';
import React from 'react';

type Props = {
  value: number;
  isLoading?: boolean;
}

const GasUsedToTargetRatio = ({ value, isLoading }: Props) => {
  return (
    <Tooltip label="% of Gas Target">
      <Skeleton color="text_secondary" isLoaded={ !isLoading }>
        <span>{ (value > 0 ? '+' : '') + value.toLocaleString(undefined, { maximumFractionDigits: 2 }) }%</span>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(GasUsedToTargetRatio);
