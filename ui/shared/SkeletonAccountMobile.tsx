import { Flex, Skeleton, SkeletonCircle, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const SkeletonAccountMobile = () => {
  return (
    <Flex
      rowGap={ 3 }
      flexDirection="column"
      paddingY={ 6 }
      borderTopWidth="1px"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      _first={{
        borderTopWidth: '0',
        pt: '0',
      }}
    >
      <Flex columnGap={ 2 } w="100%" alignItems="center">
        <SkeletonCircle size="6" flexShrink="0"/>
        <Skeleton h={ 4 } w="100%"/>
      </Flex>
      <Skeleton h={ 4 } w="164px"/>
      <Skeleton h={ 4 } w="164px"/>
      <Flex columnGap={ 3 } alignSelf="flex-end" mt={ 7 }>
        <SkeletonCircle size="6" flexShrink="0"/>
        <SkeletonCircle size="6" flexShrink="0"/>
      </Flex>
    </Flex>
  );
};

export default SkeletonAccountMobile;
