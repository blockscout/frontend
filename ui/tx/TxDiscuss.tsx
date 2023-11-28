import { Flex, useColorModeValue, Text, Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { ForumThread } from 'lib/api/ylideApi/types';

import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import ThreadReplies from 'ui/shared/forum/ThreadReplies';

const TxDiscuss = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash).toLowerCase();
  const { accounts: { initialized, tokens } } = useYlide();
  const [ thread, setThread ] = React.useState<ForumThread | undefined>();
  const getThread = ForumPublicApi.useGetThreadByTx(hash);
  const createThread = ForumPersonalApi.useCreateThread(tokens[0]);
  const toast = useToast();

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getThread().then(setThread);
  }, [ getThread, initialized ]);

  const handleCreateDiscussion = React.useCallback(async() => {
    // blockchainAddress
    // blockchainTx
    try {
      const thread = await createThread({
        title: `Let's discuss tx "${ hash }"`,
        description: `Transaction "${ hash }" discussion`,
        blockchainTx: hash,
        topic: '27',
        tags: [],
      });
      setThread(thread);
    } catch (err) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (err as ({ payload: string } | undefined))?.payload || 'There was an error while creating thread.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }, [ hash, createThread, toast ]);

  const mutedColor = useColorModeValue('gray.500', 'gray.500');

  if (!thread) {
    return (
      <Flex flexDir="column" align="flex-start">
        <Text color={ mutedColor }>There’s no discussions about this transaction yet.</Text>
        <Button mt={ 4 } onClick={ handleCreateDiscussion }>Create discussion</Button>
      </Flex>
    );
  }

  return (
    <ThreadReplies thread={ thread } skipThreadBody={ false }/>
  );
};

export default TxDiscuss;
