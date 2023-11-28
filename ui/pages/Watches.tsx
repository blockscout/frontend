import { Flex, HStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { useYlide } from 'lib/contexts/ylide';
import getQueryParamString from 'lib/router/getQueryParamString';
import shortenString from 'lib/shortenString';
import ActionBar from 'ui/shared/ActionBar';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import WatchedThreads from 'ui/shared/forum/WatchedThreads';
import WatchedTopics from 'ui/shared/forum/WatchedTopics';
import PageTitle from 'ui/shared/Page/PageTitle';
import TabsWithScroll from 'ui/shared/Tabs/TabsWithScroll';

const WatchesPageContent = () => {
  const router = useRouter();
  const { accounts: { domainAccounts } } = useYlide();
  const hash = getQueryParamString(router.query.hash).toLowerCase();
  const account = domainAccounts.find(d => d.account.address.toLowerCase() === hash);

  const actionBar = (
    <ActionBar mt={ -3 } flexDir={{ sm: 'row', base: 'column' }} alignItems={{ sm: 'center', base: 'stretch' }}>
      <HStack spacing={ 3 } alignItems={{ sm: 'center', base: 'stretch' }}>
        { hash }
      </HStack>
    </ActionBar>
  );

  return (
    <Flex position="relative" flexDir="column">
      <HStack align="center" justify="space-between" mb={ 6 }>
        <PageTitle
          backLink={{ url: '/forum', label: 'Dev forum' }}
          containerProps={{ mb: 0 }}
          title={ `Watches of "${ shortenString(hash) }"` }
          justifyContent="space-between"
        />
        <ChatsAccountsBar/>
      </HStack>
      { actionBar }
      <Flex mb={ 6 } flexDir="column" w="100%" align="stretch">
        { account && account.backendAuthKey ? (
          <TabsWithScroll
            w="100%"
            grow={ 1 }
            tabs={ [
              {
                id: 'topics',
                title: 'Topics',
                component: <WatchedTopics account={ account }/>,
              },
              {
                id: 'threads',
                title: 'Threads',
                component: <WatchedThreads account={ account }/>,
              },
              // {
              //   id: 'replies',
              //   title: 'Replies',
              //   component: null,
              // },
              // {
              //   id: 'addresses',
              //   title: 'Addresses',
              //   component: null,
              // },
            ] }
          />
        ) : (
          <Text>Account not found</Text>
        ) }
      </Flex>
    </Flex>
  );
};

export default WatchesPageContent;
