import { Flex, HStack, Button, Input, VStack } from '@chakra-ui/react';
import { YMF } from '@ylide/sdk';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import type { ForumTopic } from 'lib/api/ylideApi/types';

import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import Editor from 'ui/shared/forum/Editor';
import PageTitle from 'ui/shared/Page/PageTitle';

const CreateThreadPageContent = () => {
  const router = useRouter();
  const { accounts: { tokens, domainAccounts, initialized }, broadcastMessage } = useYlide();
  const [ topic, setTopic ] = React.useState<ForumTopic | undefined>();
  const topicString = getQueryParamString(router.query.topic);
  const getTopic = ForumPublicApi.useGetTopic(topicString);
  const createThread = ForumPersonalApi.useCreateThread(tokens[0]);

  const [ sending, setSending ] = useState(false);
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

  const handleTextChange = useCallback((value: string) => {
    setText(value);
  }, []);

  const handleCreate = useCallback(async() => {
    if (!topic) {
      return;
    }
    setSending(true);
    try {
      const result = await createThread({ topic: topic.id, title, description: text, tags: [] });
      await broadcastMessage(domainAccounts[0], result.feedId, title, YMF.fromYMFText(text));
      setSending(false);
      router.push({ pathname: '/forum/[topic]/[thread]', query: { topic: topicString, thread: result.slug } });
    } catch (err) {
      setSending(false);
    }
  }, [ topic, createThread, title, text, broadcastMessage, domainAccounts, router, topicString ]);

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
        <Editor
          value={ text }
          onChange={ handleTextChange }
        />
        <Flex flexDir="row" justifyContent="flex-end">
          <Button isLoading={ sending } onClick={ handleCreate }>Create</Button>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default CreateThreadPageContent;
