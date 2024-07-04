import { useToken } from '@chakra-ui/react';
import React from 'react';

import { calculateRowTransformValue, LABEL_WIDTH } from './utils';

interface Props {
  label: string;
  lineNum: number;
}

const ChartTooltipRow = ({ label, lineNum }: Props) => {
  const labelColor = useToken('colors', 'blue.100');
  const textColor = useToken('colors', 'white');

  return (
    <g className="ChartTooltip__row" transform={ calculateRowTransformValue(lineNum) }>
      <text
        className="ChartTooltip__label"
        transform="translate(0,0)"
        fill={ labelColor }
      >
        { label }
      </text>
      <text
        className="ChartTooltip__value"
        transform={ `translate(${ LABEL_WIDTH },0)` }
        fill={ textColor }
      />
    </g>
  );
};

export default React.memo(ChartTooltipRow);
