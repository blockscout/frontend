import { useToken } from '@chakra-ui/react';
import React from 'react';

const ChartTooltipLine = () => {
  const lineColor = useToken('colors', 'gray.400');
  return <line className="ChartTooltip__line" stroke={ lineColor } strokeDasharray="3"/>;
};

export default React.memo(ChartTooltipLine);
