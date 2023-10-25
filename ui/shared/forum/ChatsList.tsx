import { VStack } from '@chakra-ui/react';
import type { IMessage } from '@ylide/sdk';
import React from 'react';

import type { IMessageDecodedContent } from 'lib/contexts/ylide';

import ChatEntity from './ChatEntity';

interface Props {
  chats: Array<{
    address: string;
    msgId?: string;
    metadata?: IMessage;
    isSentByYou?: boolean;
    lastMessageTimestamp?: number;
  }>;
  decodedMessages: Record<string, IMessageDecodedContent | null>;
}

const ChatsList = ({ chats, decodedMessages }: Props) => {
  return (
    <VStack align="stretch" spacing={ 4 } mb={ 10 }>
      { chats.map((item) => (
        <ChatEntity
          key={ item.address }
          decodedMessages={ decodedMessages }
          { ...item }
        />
      )) }
    </VStack>
  );
};

export default ChatsList;
