import { useToken } from '@chakra-ui/react';
import React from 'react';

import { calculateRowTransformValue } from './utils';

const ChartTooltipTitle = () => {
  const titleColor = useToken('colors', 'yellow.300');

  return (
    <g className="ChartTooltip__row" transform={ calculateRowTransformValue(0) }>
      <text
        className="ChartTooltip__title"
        transform="translate(0,0)"
        fill={ titleColor }
        opacity={ 0 }
      >
        Incomplete day
      </text>
    </g>
  );
};

export default React.memo(ChartTooltipTitle);
