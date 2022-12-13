import { Skeleton, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const AddressBlocksValidatedSkeletonMobile = () => {
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
          <Flex justifyContent="space-between" w="100%" h={ 6 }>
            <Skeleton w="100px"/>
            <Skeleton w="100px"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="40px"/>
            <Skeleton w="40px"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="70px"/>
            <Skeleton w="70px"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="70px"/>
            <Skeleton w="180px"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="100px"/>
            <Skeleton w="120px"/>
          </Flex>
        </Flex>
      )) }
    </Box>
  );
};

export default AddressBlocksValidatedSkeletonMobile;
