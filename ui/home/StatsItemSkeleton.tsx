import { Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const StatsItemSkeleton = () => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex
      backgroundColor={ bgColor }
      padding={ 5 }
      borderRadius="16px"
      flexDirection={{ base: 'row', lg: 'column', xl: 'row' }}
      alignItems="center"
    >
      <Skeleton
        w="40px"
        h="40px"
        mr={{ base: 4, lg: 0, xl: 4 }}
        mb={{ base: 0, lg: 2, xl: 0 }}
      />
      <Flex flexDirection="column" alignItems={{ base: 'start', lg: 'center', xl: 'start' }}>
        <Skeleton w="69px" h="10px" mt="4px" mb="8px"/>
        <Skeleton w="93px" h="14px" mb="4px"/>
      </Flex>
    </Flex>
  );
};

export default StatsItemSkeleton;
