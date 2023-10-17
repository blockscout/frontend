import { Flex, useColorModeValue, Text } from '@chakra-ui/react';
import type { IMessage } from '@ylide/sdk';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { MessageDecodedTextDataType, type IMessageDecodedContent } from 'lib/contexts/ylide';

import AddressEntity from '../entities/address/AddressEntity';

export interface ChatDescriptor {
  address: string;
  msgId: string;
  metadata: IMessage;
  lastMessageTimestamp: number;
  decodedMessages: Record<string, IMessageDecodedContent | null>;
}

const ChatEntity = ({ address, msgId, decodedMessages, lastMessageTimestamp }: ChatDescriptor) => {
  const router = useRouter();
  const dateColor = useColorModeValue('gray.600', 'gray.600');
  const handleClick = React.useCallback(() => {
    router.push({ pathname: '/forum/chats/[hash]', query: { hash: address } });
  }, [ router, address ]);

  const text = useMemo(() => {
    let content = typeof decodedMessages[msgId] === 'undefined' ? 'Decoding...' : 'No content available...';
    const dec = decodedMessages[msgId];
    if (dec) {
      if (dec.decodedTextData.type === MessageDecodedTextDataType.PLAIN) {
        content = dec.decodedTextData.value;
      } else {
        content = dec.decodedTextData.value.toPlainText();
      }
    }
    return content;
  }, [ decodedMessages, msgId ]);

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
        <AddressEntity address={{ hash: address }} noCopy truncation="constant"/>
      </Flex>
      <Flex flexDir="row" align="center" grow={ 1 }>
        <Flex flexDir="row" maxW="500px" maxH="2rem" overflow="hidden">
          <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" as="span">
            { text.substring(0, 100) }
          </Text>
        </Flex>
      </Flex>
      <Flex flexDir="row" align="center" justifyContent="flex-end" gap={ 3 }>
        { /* <Tag colorScheme="blue">2</Tag> */ }
        <Text color={ dateColor }>{ new Date(lastMessageTimestamp * 1000).toLocaleString('en-GB', {
          dateStyle: 'short',
          timeStyle: 'short',
        }) }</Text>
      </Flex>
    </Flex>
  );
};

export default ChatEntity;
