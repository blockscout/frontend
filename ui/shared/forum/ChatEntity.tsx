import { Flex, useColorModeValue, Text, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import AddressEntity from '../entities/address/AddressEntity';

export interface ChatDescriptor {
  authorAddress: string;
  authorENS?: string;
  date: number;
  text: string;
}

const ChatEntity = ({ authorAddress, authorENS, text }: ChatDescriptor) => {
  const router = useRouter();
  const dateColor = useColorModeValue('gray.600', 'gray.600');
  const handleClick = React.useCallback(() => {
    router.push({ pathname: '/forum/chats/[hash]', query: { hash: authorAddress } });
  }, [ router, authorAddress ]);
  return (
    <Flex
      onClick={ handleClick }
      flexDir="row"
      padding={ 6 }
      border="1px solid"
      borderRadius={ 12 }
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      cursor="pointer"
      _hover={{
        borderColor: useColorModeValue('blackAlpha.200', 'whiteAlpha.300'),
        backgroundColor: useColorModeValue('blackAlpha.50', 'whiteAlpha.50'),
      }}
    >
      <Flex flexDir="row" flexBasis="200px" grow={ 0 } shrink={ 0 } align="center">
        <AddressEntity address={{ hash: authorAddress, name: authorENS }} noCopy truncation="constant"/>
      </Flex>
      <Flex flexDir="row" align="center" grow={ 1 }>
        <Flex flexDir="row" maxW="500px" maxH="2rem" overflow="hidden">
          <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" as="span">{ text }</Text>
        </Flex>
      </Flex>
      <Flex flexDir="row" align="center" justifyContent="flex-end" gap={ 3 }>
        <Tag colorScheme="blue">2</Tag>
        <Text color={ dateColor }>12:21</Text>
      </Flex>
    </Flex>
  );
};

export default ChatEntity;
