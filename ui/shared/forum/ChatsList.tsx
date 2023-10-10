import { VStack } from '@chakra-ui/react';
import React from 'react';

import type { ChatDescriptor } from './ChatEntity';
import ChatEntity from './ChatEntity';

interface Props {
  chats: Array<ChatDescriptor>;
}

const ChatsList = ({ chats }: Props) => {
  return (
    <VStack align="stretch" spacing={ 4 } mb={ 10 }>
      { chats.map((item) => (
        <ChatEntity
          key={ item.authorAddress }
          { ...item }
        />
      )) }
    </VStack>
  );
};

export default ChatsList;
