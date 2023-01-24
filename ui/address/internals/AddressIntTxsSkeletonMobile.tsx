import { Skeleton, SkeletonCircle, Flex, Box } from '@chakra-ui/react';
import React from 'react';

const TxInternalsSkeletonMobile = () => {
  return (
    <Box>
      { Array.from(Array(2)).map((item, index) => (
        <Flex
          key={ index }
          rowGap={ 3 }
          flexDirection="column"
          paddingY={ 6 }
          borderTopWidth="1px"
          borderColor="divider"
          _last={{
            borderBottomWidth: '1px',
          }}
        >
          <Flex h={ 6 }>
            <Skeleton w="100px" mr={ 2 }/>
            <Skeleton w="90px"/>
          </Flex>
          <Flex h={ 6 }>
            <Skeleton w="100%" mr={ 2 }/>
            <Skeleton w="60px"/>
          </Flex>
          <Flex h={ 6 }>
            <Skeleton w="70px" mr={ 2 }/>
            <Skeleton w="30px"/>
          </Flex>
          <Flex h={ 6 }>
            <SkeletonCircle size="6" mr={ 2 } flexShrink={ 0 }/>
            <Skeleton flexGrow={ 1 } mr={ 3 }/>
            <Skeleton w={ 6 } mr={ 3 }/>
            <SkeletonCircle size="6" mr={ 2 } flexShrink={ 0 }/>
            <Skeleton flexGrow={ 1 } mr={ 3 }/>
          </Flex>
          <Flex h={ 6 }>
            <Skeleton w="70px" mr={ 2 }/>
            <Skeleton w="30px"/>
          </Flex>
        </Flex>
      )) }
    </Box>
  );
};

export default TxInternalsSkeletonMobile;
