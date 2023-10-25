import { Flex, useColorModeValue, Text, Box } from '@chakra-ui/react';
import type { IMessage } from '@ylide/sdk';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { MessageDecodedTextDataType, type IMessageDecodedContent } from 'lib/contexts/ylide';
import formatDateTime from 'lib/formatDateTime';
import useIsMobile from 'lib/hooks/useIsMobile';

import AddressEntity from '../entities/address/AddressEntity';

export interface ChatDescriptor {
  address: string;
  msgId?: string;
  metadata?: IMessage;
  isSentByYou?: boolean;
  lastMessageTimestamp?: number;
  decodedMessages: Record<string, IMessageDecodedContent | null>;
}

const ChatEntity = ({ address, msgId, decodedMessages, lastMessageTimestamp }: ChatDescriptor) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const dateColor = useColorModeValue('gray.600', 'gray.600');
  const handleClick = React.useCallback(() => {
    router.push({ pathname: '/forum/chats/[hash]', query: { hash: address } });
  }, [ router, address ]);

  const text = useMemo(() => {
    if (!msgId) {
      return 'Open chat to send message';
    }
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
      padding={{ base: 3, sm: 6 }}
      border="1px solid"
      borderRadius={ 12 }
      borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
      cursor="pointer"
      _hover={{
        borderColor: useColorModeValue('blackAlpha.200', 'whiteAlpha.300'),
        backgroundColor: useColorModeValue('blackAlpha.50', 'whiteAlpha.50'),
      }}
    >
      <Flex flexDir="row" flexBasis={{ base: '80px', sm: '200px' }} mr={ 3 } grow={ 0 } shrink={ 0 } align="center">
        <AddressEntity address={{ hash: address }} noCopy truncation="constant"/>
      </Flex>
      <Flex flexDir="row" align="center" grow={ 1 } alignItems="stretch">
        <Flex flexDir="row" maxW="500px" maxH="2rem" overflow="hidden" alignItems="stretch" grow={ 1 } mr={ 2 }>
          <Box pos="relative" flexGrow={ 1 }>
            <Text
              left={ 0 }
              right={ 0 }
              top={ 0 }
              bottom={ 0 }
              pos="absolute"
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              as="span"
            >
              { text.substring(0, 100) }
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex flexDir="row" align="center" justifyContent="flex-end" gap={ 3 }>
        { /* <Tag colorScheme="blue">2</Tag> */ }
        { lastMessageTimestamp ? (
          <Text color={ dateColor }>{ formatDateTime(new Date(lastMessageTimestamp * 1000), {
            timeWithoutSeconds: isMobile,
            dateWithoutYear: isMobile,
          }) }</Text>
        ) : null }
      </Flex>
    </Flex>
  );
};

export default ChatEntity;
