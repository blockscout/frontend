import { Box, Skeleton } from '@chakra-ui/react';
import React from 'react';

const ChartWidgetSkeleton = () => {
  return (
    <Box
      height="235px"
      padding={{ base: 3, md: 4 }}
    >
      <Skeleton w="75%" h="24px" mb={ 1 }/>
      <Skeleton w="50%" h="18px" mb={ 5 }/>

      <Skeleton w="100%" h="150px"/>
    </Box>
  );
};

export default ChartWidgetSkeleton;
