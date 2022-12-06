import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const TokenItem = ({ children }: Props) => {
  return (
    <Flex
      px={ 1 }
      py="10px"
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderBottomWidth="1px"
      _hover={{
        bgColor: useColorModeValue('blue.50', 'gray.800'),
      }}
      fontSize="sm"
      cursor="pointer"
    >
      { children }
    </Flex>
  );
};

export default React.memo(TokenItem);
