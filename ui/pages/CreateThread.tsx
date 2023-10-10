import { Flex, HStack, Button, Input, Textarea, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import type { ForumTopic } from 'lib/api/ylideApi/types';

import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import PageTitle from 'ui/shared/Page/PageTitle';

const CreateThreadPageContent = () => {
  const router = useRouter();
  const { accounts: { tokens, domainAccounts, initialized }, broadcastMessage } = useYlide();
  const [ topic, setTopic ] = React.useState<ForumTopic | undefined>();
  const topicString = getQueryParamString(router.query.topic);
  const getTopic = ForumPublicApi.useGetTopic(topicString);
  const createThread = ForumPersonalApi.useCreateThread(tokens[0]);

  const [ title, setTitle ] = useState('');
  const [ text, setText ] = useState('');

  useEffect(() => {
    if (!initialized) {
      return;
    }
    getTopic().then(setTopic);
  }, [ getTopic, initialized ]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  const handleCreate = useCallback(async() => {
    if (!topic) {
      return;
    }
    const result = await createThread({ topic: topic.id, title, description: text, tags: [] });
    await broadcastMessage(domainAccounts[0], result.feedId, title, text);
  }, [ topic, createThread, title, text, broadcastMessage, domainAccounts ]);

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          backLink={{ label: `Topic ${ topic ? topic.title : '' }`, url: `/forum/${ topicString }` }}
          containerProps={{ mb: 0 }}
          title={ topic ? `New thread in topic "${ topic.title }"` : 'Loading...' }
          isLoading={ !topic }
          justifyContent="space-between"
        />
        <ChatsAccountsBar/>
      </HStack>
      <VStack gap={ 4 } alignItems="stretch">
        <Input placeholder="Title" value={ title } onChange={ handleTitleChange }/>
        <Textarea placeholder="Text" value={ text } onChange={ handleTextChange }/>
        <Flex flexDir="row" justifyContent="flex-end">
          <Button onClick={ handleCreate }>Create</Button>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default CreateThreadPageContent;
