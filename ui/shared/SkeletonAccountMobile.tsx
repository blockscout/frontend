import { Box, Flex, Skeleton, SkeletonCircle, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  showFooterSlot?: boolean;
}

const SkeletonAccountMobile = ({ showFooterSlot }: Props) => {
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
          <Flex columnGap={ 3 } mt={ 7 }>
            { showFooterSlot && (
              <Flex alignItems="center" columnGap={ 2 }>
                <Skeleton h={ 4 } w="164px"/>
                <SkeletonCircle size="6" flexShrink="0"/>
              </Flex>
            ) }
            <SkeletonCircle size="6" flexShrink="0" ml="auto"/>
            <SkeletonCircle size="6" flexShrink="0"/>
          </Flex>
        </Flex>
      )) }
    </Box>
  );
};

export default SkeletonAccountMobile;
