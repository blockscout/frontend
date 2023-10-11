import { VStack } from '@chakra-ui/react';
import React from 'react';

import ChatEntity from './ChatEntity';

interface Props {
  chats: Array<{ address: string; lastMessageTimestamp: number }>;
}

const ChatsList = ({ chats }: Props) => {
  return (
    <VStack align="stretch" spacing={ 4 } mb={ 10 }>
      { chats.map((item) => (
        <ChatEntity
          key={ item.address }
          { ...item }
        />
      )) }
    </VStack>
  );
};

export default ChatsList;
