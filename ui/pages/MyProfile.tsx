import { VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import UserAvatar from 'ui/shared/UserAvatar';

const MyProfile = () => {
  const { data, isLoading, isError, isFetched } = useFetchProfileInfo();

  const content = (() => {
    if (isLoading) {
      return <ContentLoader/>;
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    return (
      <VStack maxW="412px" mt={ 12 } gap={ 5 } alignItems="stretch">
        <UserAvatar size={ 64 } data={ data } isFetched={ isFetched }/>
        <FormControl variant="floating" id="name" isRequired size="lg">
          <Input
            required
            disabled
            value={ data.name || '' }
          />
          <FormLabel>Name</FormLabel>
        </FormControl>
        <FormControl variant="floating" id="nickname" isRequired size="lg">
          <Input
            required
            disabled
            value={ data.nickname || '' }
          />
          <FormLabel>Nickname</FormLabel>
        </FormControl>
        <FormControl variant="floating" id="email" isRequired size="lg">
          <Input
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
      <PageTitle text="My profile"/>
      { content }
    </Page>
  );
};

export default MyProfile;
