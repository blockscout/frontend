import { Skeleton, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const AddressCoinBalanceSkeletonMobile = () => {
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
            <Skeleton w="170px"/>
            <Skeleton w="120px"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="40px"/>
            <Skeleton w="80px"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="40px"/>
            <Skeleton w="150px"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="30px"/>
            <Skeleton w="60px"/>
          </Flex>
        </Flex>
      )) }
    </Box>
  );
};

export default AddressCoinBalanceSkeletonMobile;
