import { Skeleton, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  showBlockInfo: boolean;
}

const TxInternalsSkeletonMobile = ({ showBlockInfo }: Props) => {
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <Box>
      { Array.from(Array(2)).map((item, index) => (
        <Flex
          key={ index }
          flexDirection="column"
          paddingBottom={ 3 }
          paddingTop={ 4 }
          borderTopWidth="1px"
          borderColor={ borderColor }
          _last={{
            borderBottomWidth: '1px',
          }}
        >
          <Flex h={ 6 }>
            <Skeleton w="100px" mr={ 2 } h={ 6 }/>
            <Skeleton w="100px" h={ 6 }/>
          </Flex>
          <Skeleton w="100%" h="30px" mt={ 3 }/>
          <Skeleton w="50%" h={ 6 } mt={ 3 }/>
          <Skeleton w="50%" h={ 6 } mt={ 2 }/>
          { showBlockInfo && <Skeleton w="100%" h={ 6 } mt={ 6 }/> }
          <Skeleton w="50%" h={ 6 } mt={ 2 }/>
          <Skeleton w="50%" h={ 6 } mt={ 2 }/>
        </Flex>
      )) }
    </Box>
  );
};

export default TxInternalsSkeletonMobile;
