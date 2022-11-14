import { Box, Circle, Text } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

interface Props {
  data: TimeChartData;
  selectedIndexes: Array<number>;
  onClick: (index: number) => void;
}

const ChartLegend = ({ data, selectedIndexes, onClick }: Props) => {
  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const itemIndex = (event.currentTarget as HTMLDivElement).getAttribute('data-index');
    onClick(Number(itemIndex));
  }, [ onClick ]);

  return (
    <Box display="flex" columnGap={ 3 } mt={ 2 }>
      { data.map(({ name, color }, index) => {
        const isSelected = selectedIndexes.includes(index);
        return (
          <Box
            key={ name }
            data-index={ index }
            display="flex"
            columnGap={ 1 }
            alignItems="center"
            onClick={ handleItemClick }
            cursor="pointer"
          >
            <Circle
              size={ 2 }
              bgColor={ isSelected ? color : 'transparent' }
              borderWidth={ 2 }
              borderColor={ color }
            />
            <Text fontSize="xs">
              { name }
            </Text>
          </Box>
        );
      }) }
    </Box>
  );
};

export default React.memo(ChartLegend);
