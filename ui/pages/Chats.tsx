import { Flex, HStack } from '@chakra-ui/react';
import type { IMessage } from '@ylide/sdk';
import { useRouter } from 'next/router';
import React from 'react';

import ChatsPersonalApi from 'lib/api/ylideApi/ChatsPersonalApi';
import type { IMessageDecodedContent } from 'lib/contexts/ylide';
import { useYlide } from 'lib/contexts/ylide';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import ChatsList from 'ui/shared/forum/ChatsList';
import PageTitle from 'ui/shared/Page/PageTitle';

const ChatsPageContent = () => {
  const router = useRouter();
  const [ reloadTick, setReloadTick ] = React.useState(0);
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const { accounts: { initialized, domainAccounts }, decodeDirectMessage } = useYlide();
  const [ chats, setChats ] = React.useState<{
    result: true;
    data: {
      totalCount: string;
      entries: Array<{
        address: string;
        msgId: string;
        metadata: IMessage;
        isSentByYou: boolean;
        lastMessageTimestamp: number;
      }>;
    };
  }>({
    result: true,
    data: {
      totalCount: '0',
      entries: [],
    },
  });
  const [ decodedMessages, setDecodedMessages ] = React.useState<Record<string, IMessageDecodedContent | null>>({});
  const getChats = ChatsPersonalApi.useGetChats();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setReloadTick(tick => tick + 1);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    (async() => {
      let isChanged = false;
      const newDecodedMessages = { ...decodedMessages };
      await Promise.all(chats.data.entries.map(async m => {
        if (typeof newDecodedMessages[m.msgId] !== 'undefined') {
          return;
        }
        const decoded = await decodeDirectMessage(m.msgId, m.metadata, domainAccounts[0].account);
        newDecodedMessages[m.msgId] = decoded;
        isChanged = true;
      }));
      if (isChanged) {
        setDecodedMessages(newDecodedMessages);
      }
    })();
  }, [ chats, decodedMessages, domainAccounts, decodeDirectMessage ]);

  React.useEffect(() => {
    if (initialized && domainAccounts.length && reloadTick >= 0) {
      getChats(domainAccounts[0].account.address).then(setChats);
    }
  }, [ initialized, domainAccounts, getChats, reloadTick ]);

  const filterInput = (
    <FilterInput
      w="100%"
      minW={{ base: '100px', sm: '400px' }}
      size="xs"
      onChange={ setFilter }
      placeholder="Search by type, address, hash, method..."
      initialValue={ filter }
    />
  );

  const actionBar = (
    <ActionBar mt={ -3 } flexDir={{ sm: 'row', base: 'column' }} alignItems={{ sm: 'center', base: 'stretch' }}>
      <HStack spacing={ 3 }>
        { filterInput }
      </HStack>
      { /* <Pagination ml="auto" { ...pagination }/> */ }
    </ActionBar>
  );

  let filteredEntries: Array<{
    address: string;
  }> = chats.data.entries.filter(m => m.address.toLowerCase().includes(filter.toLowerCase()));
  if (!filteredEntries.length && filter.length === 42 && filter.startsWith('0x')) {
    filteredEntries = [
      {
        address: filter.toLowerCase(),
      },
    ];
  }

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          backLink={{ url: '/forum', label: 'Dev forum' }}
          containerProps={{ mb: 0 }}
          title="Chats"
        />
        <ChatsAccountsBar noChats/>
      </HStack>
      { actionBar }
      <ChatsList chats={ filteredEntries } decodedMessages={ decodedMessages }/>
    </Flex>
  );
};

export default ChatsPageContent;
