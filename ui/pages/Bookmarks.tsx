import { Flex, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import shortenString from 'lib/shortenString';
import ActionBar from 'ui/shared/ActionBar';
import ChatsAccountsBar from 'ui/shared/forum/ChatsAccountsBar';
import PageTitle from 'ui/shared/Page/PageTitle';

const BookmarksPageContent = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash).toLowerCase();
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
        <PageTitle containerProps={{ mb: 0 }} title={ `Bookmarks of "${ shortenString(hash) }"` } justifyContent="space-between"/>
        <ChatsAccountsBar compact={ true }/>
      </HStack>
      { actionBar }
    </Flex>
  );
};

export default BookmarksPageContent;
