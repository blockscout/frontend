import { Box, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const NumberWidgetSkeleton = () => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Box
      backgroundColor={ bgColor }
      p={ 3 }
      borderRadius={ 12 }
    >
      <Skeleton w="70px" h="10px" mb={ 2 }/>

      <Skeleton w="100px" h="27px"/>
    </Box>
  );
};

export default NumberWidgetSkeleton;
