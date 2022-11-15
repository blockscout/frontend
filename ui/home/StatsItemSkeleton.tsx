import { Box, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const StatsItemSkeleton = () => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex background={ bgColor } padding={ 5 } borderRadius="16px">
      <Skeleton w="40px" h="40px"/>
      <Box ml={ 4 }>
        <Skeleton w="69px" h="10px" mb="10px"/>
        <Skeleton w="93px" h="10px"/>
      </Box>
    </Flex>
  );
};

export default StatsItemSkeleton;
