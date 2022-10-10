import { Skeleton, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const BlocksSkeletonMobile = () => {
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <Box>
      { Array.from(Array(2)).map((item, index) => (
        <Flex
          key={ index }
          rowGap={ 3 }
          flexDirection="column"
          paddingY={ 6 }
          borderTopWidth="1px"
          borderColor={ borderColor }
          _last={{
            borderBottomWidth: '1px',
          }}
        >
          <Flex h={ 6 } justifyContent="space-between">
            <Skeleton w="75px"/>
            <Skeleton w="90px"/>
          </Flex>
          <Skeleton h={ 6 } w="130px"/>
          <Skeleton h={ 6 } w="180px"/>
          <Skeleton h={ 6 } w="60px"/>
          <Skeleton h={ 6 } w="100%"/>
          <Skeleton h={ 6 } w="170px"/>
          <Skeleton h={ 6 } w="100%"/>
        </Flex>
      )) }
    </Box>
  );
};

export default BlocksSkeletonMobile;
