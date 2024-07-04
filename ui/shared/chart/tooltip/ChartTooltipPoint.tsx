import { useColorModeValue, useToken } from '@chakra-ui/react';
import React from 'react';

import { POINT_SIZE } from './utils';

const ChartTooltipPoint = () => {
  const bgColor = useToken('colors', useColorModeValue('black', 'white'));
  const borderColor = useToken('colors', useColorModeValue('white', 'black'));

  return (
    <circle
      className="ChartTooltip__point"
      r={ POINT_SIZE / 2 }
      opacity={ 0 }
      fill={ bgColor }
      stroke={ borderColor }
      strokeWidth={ 4 }
    />
  );
};

export default React.memo(ChartTooltipPoint);
