import { Box, Skeleton } from '@chakra-ui/react';
import React from 'react';

interface Props {
  hasDescription: boolean;
  chartHeight?: string;
}

const ChartWidgetSkeleton = ({ hasDescription, chartHeight }: Props) => {
  return (
    <Box
      height="235px"
      paddingY={{ base: 3, lg: 4 }}
    >
      <Skeleton w="75%" h="24px"/>
      { hasDescription && <Skeleton w="50%" h="18px" mt={ 1 }/> }

      <Skeleton w="100%" h={ chartHeight || '150px' } mt={ 5 }/>
    </Box>
  );
};

export default ChartWidgetSkeleton;
