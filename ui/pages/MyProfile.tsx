import { VStack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';
import UserAvatar from 'ui/shared/UserAvatar';

const MyProfile = () => {
  const { data, isLoading, isError, error } = useFetchProfileInfo();
  useRedirectForInvalidAuthToken();

  const content = (() => {
    if (isLoading) {
      return <ContentLoader/>;
    }

    if (isError) {
      if (error.status === 403) {
        throw new Error('Unverified email error', { cause: error });
      }
      return <DataFetchAlert/>;
    }

    return (
      <VStack maxW="412px" mt={ 8 } gap={ 5 } alignItems="stretch">
        <UserAvatar size={ 64 }/>
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
    <>
      <PageTitle title="My profile"/>
      { content }
    </>
  );
};

export default MyProfile;
