import { VStack } from '@chakra-ui/react';
import React from 'react';

import type { ForumReply } from 'lib/api/ylideApi/types';

import ReplyEntity from './ReplyEntity';

interface Props {
  replies: Array<ForumReply>;
  onReplyTo?: (reply: ForumReply) => void;
}

const RepliesList = ({ replies, onReplyTo }: Props) => {
  return (
    <VStack align="stretch" spacing={ 4 } mb={ 10 }>
      { replies.map((item) => (
        <ReplyEntity
          key={ item.id }
          onReplyTo={ onReplyTo }
          { ...item }
        />
      )) }
    </VStack>
  );
};

export default RepliesList;
