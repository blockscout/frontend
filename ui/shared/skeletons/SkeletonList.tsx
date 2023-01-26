import { Box, Flex, Skeleton, SkeletonCircle, chakra } from '@chakra-ui/react';
import React from 'react';

const SkeletonList = ({ className }: {className?: string}) => {
  return (
    <Box className={ className }>
      { Array.from(Array(2)).map((item, index) => (
        <Flex
          key={ index }
          rowGap={ 4 }
          flexDirection="column"
          paddingY={ 6 }
          borderTopWidth="1px"
          borderColor="divider"
          _last={{
            borderBottomWidth: '0px',
          }}
        >
          <Flex h={ 4 }>
            <Skeleton w="30%" mr={ 2 } borderRadius="full"/>
            <Skeleton w="15%" borderRadius="full"/>
          </Flex>
          <Flex h={ 4 }>
            <SkeletonCircle boxSize={ 4 } mr={ 2 } flexShrink={ 0 }/>
            <Skeleton flexGrow={ 1 } mr={ 3 } borderRadius="full"/>
            <Skeleton w={ 6 } mr={ 3 } borderRadius="full"/>
            <SkeletonCircle boxSize={ 4 } mr={ 2 } flexShrink={ 0 }/>
            <Skeleton flexGrow={ 1 } mr={ 3 } borderRadius="full"/>
          </Flex>
          <Skeleton w="75%" h={ 4 } borderRadius="full"/>
          <Skeleton w="60%" h={ 4 } borderRadius="full"/>
        </Flex>
      )) }
    </Box>
  );
};

export default chakra(SkeletonList);
