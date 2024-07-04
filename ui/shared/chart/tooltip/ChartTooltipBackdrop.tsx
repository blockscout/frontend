import { useToken } from '@chakra-ui/react';
import React from 'react';

import { calculateContainerHeight } from './utils';

interface Props {
  seriesNum: number;
  width: number;
}

const ChartTooltipBackdrop = ({ seriesNum, width }: Props) => {
  const bgColor = useToken('colors', 'blackAlpha.900');

  return (
    <rect
      className="ChartTooltip__backdrop"
      rx={ 12 }
      ry={ 12 }
      fill={ bgColor }
      width={ width }
      height={ calculateContainerHeight(seriesNum) }
    />
  );
};

export default React.memo(ChartTooltipBackdrop);
