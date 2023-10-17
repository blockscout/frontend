import { Flex, HStack, Button, Input, VStack } from '@chakra-ui/react';
import { EVMNetwork, EVM_CHAINS, EVM_NAMES } from '@ylide/ethereum';
import { YMF } from '@ylide/sdk';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import type { ForumTopic } from 'lib/api/ylideApi/types';
import type { DomainAccount } from 'lib/contexts/ylide/types';

import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import Editor from 'ui/shared/forum/Editor';
import SelectAccountDropdown from 'ui/shared/forum/SelectAccountDropdown';
import SelectBlockchainDropdown from 'ui/shared/forum/SelectBlockchainDropdown';
import PageTitle from 'ui/shared/Page/PageTitle';

const CreateThreadPageContent = () => {
  const router = useRouter();
  const { accounts: { tokens, domainAccounts, initialized }, broadcastMessage } = useYlide();
  const [ topic, setTopic ] = React.useState<ForumTopic | undefined>();
  const [ account, setAccount ] = React.useState<DomainAccount | undefined>(domainAccounts[0]);
  const [ blockchain, setBlockchain ] = React.useState<string>('GNOSIS');
  const topicString = getQueryParamString(router.query.topic);
  const getTopic = ForumPublicApi.useGetTopic(topicString);
  const createThread = ForumPersonalApi.useCreateThread(tokens[0]);

  const [ sending, setSending ] = useState(false);
  const [ title, setTitle ] = useState('');
  const [ text, setText ] = useState('');

  useEffect(() => {
    if (!account && domainAccounts.length) {
      setAccount(domainAccounts[0]);
    } else
    if (account && domainAccounts.findIndex(d => d.account.address === account.account.address) === -1) {
      setAccount(undefined);
    }
  }, [ account, domainAccounts ]);

  const handleAccountChange = useCallback((newAccount: DomainAccount | undefined) => {
    setAccount(newAccount);
  }, []);

  const handleBlockchainChange = useCallback((newBlockchain: string) => {
    setBlockchain(newBlockchain);
    if (account) {
      const networkByName = (name: string) =>
        Object.values(EVMNetwork).filter(t => !isNaN(Number(t))).find(t => EVM_NAMES[Number(t) as EVMNetwork] === name) as EVMNetwork;
      const network = networkByName(newBlockchain);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      account.wallet.onNetworkSwitchRequest('', undefined, network, EVM_CHAINS[network]);
    }
  }, [ account ]);

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
        <Flex flexDir="row" justify="space-between">
          <SelectAccountDropdown
            value={ account }
            onChange={ handleAccountChange }
          />
          <Flex flexDir="row" align="center" gap={ 6 }>
            <SelectBlockchainDropdown
              value={ blockchain }
              onChange={ handleBlockchainChange }
            />
            <Flex flexDir="row" align="center">
              <Button isLoading={ sending } onClick={ handleCreate }>Create</Button>
            </Flex>
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default CreateThreadPageContent;
