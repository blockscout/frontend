import { VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import AccountPageHeader from 'ui/shared/AccountPageHeader';
import ContentLoader from 'ui/shared/ContentLoader';
import Page from 'ui/shared/Page/Page';
import UserAvatar from 'ui/shared/UserAvatar';

const MyProfile = () => {
  const { data, isLoading, isError } = useQuery<unknown, unknown, UserInfo>([ 'profile' ], async() => {
    const response = await fetch('/api/account/profile');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  const content = (() => {
    if (isLoading || isError) {
      return <ContentLoader/>;
    }

    return (
      <VStack maxW="412px" mt={ 12 } gap={ 5 } alignItems="stretch">
        <UserAvatar size={ 64 } data={ data }/>
        <FormControl variant="floating" id="name" isRequired size="lg">
          <Input
            size="lg"
            required
            disabled
            value={ data.name || '' }
          />
          <FormLabel>Name</FormLabel>
        </FormControl>
        <FormControl variant="floating" id="nickname" isRequired size="lg">
          <Input
            size="lg"
            required
            disabled
            value={ data.nickname || '' }
          />
          <FormLabel>Nickname</FormLabel>
        </FormControl>
        <FormControl variant="floating" id="email" isRequired size="lg">
          <Input
            size="lg"
            required
            disabled
            value={ data.email }
          />
          <FormLabel>Email</FormLabel>
        </FormControl>
      </VStack>
    );
  })();

  return (
    <Page>
      <AccountPageHeader text="My profile"/>
      { content }
    </Page>
  );
};

export default MyProfile;
