import { Flex, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import ChatsPersonalApi from 'lib/api/ylideApi/ChatsPersonalApi';
import { useYlide } from 'lib/contexts/ylide';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import ChatsList from 'ui/shared/forum/ChatsList';
import PageTitle from 'ui/shared/Page/PageTitle';

const ChatsPageContent = () => {
  const router = useRouter();
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  const { accounts: { initialized, domainAccounts } } = useYlide();
  const [ chats, setChats ] = React.useState<{
    result: true;
    data: {
      totalCount: string;
      entries: Array<{
        address: string;
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
  const getChats = ChatsPersonalApi.useGetChats();

  React.useEffect(() => {
    if (initialized && domainAccounts.length) {
      getChats(domainAccounts[0].account.address).then(setChats);
    }
  }, [ initialized, domainAccounts, getChats ]);

  const onSearchChange = useCallback((value: string) => {
    // onFilterChange({ q: value });
    setFilter(value);
  }, [ ]); // onFilterChange

  const filterInput = (
    <FilterInput
      w="100%"
      minW="400px"
      size="xs"
      onChange={ onSearchChange }
      placeholder="Search by type, address, hash, method..."
      initialValue={ filter }
    />
  );

  const actionBar = (
    <ActionBar mt={ -3 }>
      <HStack spacing={ 3 }>
        { filterInput }
      </HStack>
      { /* <Pagination ml="auto" { ...pagination }/> */ }
    </ActionBar>
  );

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          backLink={{ url: '/forum', label: 'Dev forum' }}
          containerProps={{ mb: 0 }}
          title="Chats"
        />
        <ChatsAccountsBar compact={ true } noChats/>
      </HStack>
      { actionBar }
      <ChatsList chats={ chats.data.entries }/>
    </Flex>
  );
};

export default ChatsPageContent;
