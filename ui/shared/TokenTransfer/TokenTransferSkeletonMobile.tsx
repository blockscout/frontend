import { Skeleton, SkeletonCircle, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const TokenTransferSkeletonMobile = () => {
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
          <Flex h={ 6 }>
            <SkeletonCircle size="6" mr={ 2 } flexShrink={ 0 }/>
            <Skeleton w="100px" mr={ 2 }/>
            <Skeleton w="50px"/>
            <Skeleton w="24px" ml="auto"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="70px"/>
            <Skeleton w="24px"/>
            <Skeleton w="90px"/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="70px" flexShrink={ 0 }/>
            <Skeleton w="100%"/>
          </Flex>
          <Flex h={ 6 }>
            <SkeletonCircle size="6" mr={ 2 } flexShrink={ 0 }/>
            <Skeleton flexGrow={ 1 } mr={ 3 }/>
            <Skeleton w="50px" mr={ 3 }/>
            <SkeletonCircle size="6" mr={ 2 } flexShrink={ 0 }/>
            <Skeleton flexGrow={ 1 } mr={ 3 }/>
          </Flex>
          <Flex h={ 6 } columnGap={ 2 }>
            <Skeleton w="45px"/>
            <Skeleton w="90px"/>
          </Flex>
        </Flex>
      )) }
    </Box>
  );
};

export default TokenTransferSkeletonMobile;
