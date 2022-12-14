import { Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const StatsItemSkeleton = () => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex
      backgroundColor={ bgColor }
      padding={ 3 }
      borderRadius="md"
      flexDirection={{ base: 'row', lg: 'column', xl: 'row' }}
      alignItems="center"
      columnGap={ 3 }
      rowGap={ 2 }
    >
      <Skeleton
        w="40px"
        h="40px"
      />
      <Flex flexDirection="column" alignItems={{ base: 'start', lg: 'center', xl: 'start' }}>
        <Skeleton w="69px" h="10px" mt="4px" mb="8px"/>
        <Skeleton w="93px" h="14px" mb="4px"/>
      </Flex>
    </Flex>
  );
};

export default StatsItemSkeleton;
