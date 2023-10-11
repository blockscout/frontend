import { Flex, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

// import ChatsPersonalApi from 'lib/api/ylideApi/ChatsPersonalApi';
// import { useYlide } from 'lib/contexts/ylide';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import ChatsList from 'ui/shared/forum/ChatsList';
import PageTitle from 'ui/shared/Page/PageTitle';

const ChatsPageContent = () => {
  const router = useRouter();
  const [ filter, setFilter ] = React.useState<string>(router.query.q?.toString() || '');
  // const { accounts: { initialized, domainAccounts } } = useYlide();
  // const [ chats2, setChats ] = React.useState<Array<Record<string, string>>>([]);
  // const getChats = ChatsPersonalApi.useGetChats();

  // useEffect(() => {
  //   if (initialized && domainAccounts.length) {
  //     getChats(domainAccounts[0].account.address).then(setChats);
  //   }
  // }, [ initialized, domainAccounts, getChats ]);

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

  const defaultChat = {
    authorAddress: '0x15a33D60283e3D20751D6740162D1212c1ad2a2d',
    authorENS: 'sewald.eth',
    date: Math.floor(Date.now() / 1000) - 17 * 60,
    text: 'Lorem ipsum dolor sit amet consectetur. Diam imperdiet felis arcu eget viverra pellentesque sit quis.',
  };

  const chats = [ 1, 2, 3, 4, 5 ].map(() => ({
    ...defaultChat,
  }));

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
      <ChatsList chats={ chats }/>
    </Flex>
  );
};

export default ChatsPageContent;
