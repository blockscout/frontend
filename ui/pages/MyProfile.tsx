import { Flex } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import MyProfileEmail from 'ui/myProfile/MyProfileEmail';
import MyProfileWallet from 'ui/myProfile/MyProfileWallet';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

const MyProfile = () => {
  const profileQuery = useFetchProfileInfo();
  useRedirectForInvalidAuthToken();

  const content = (() => {
    if (profileQuery.isPending) {
      return <ContentLoader/>;
    }

    if (profileQuery.isError) {
      return <DataFetchAlert/>;
    }

    return (
      <Flex maxW="480px" mt={ 8 } flexDir="column" rowGap={ 12 }>
        <MyProfileEmail profileQuery={ profileQuery }/>
        { config.features.blockchainInteraction.isEnabled && <MyProfileWallet profileQuery={ profileQuery }/> }
      </Flex>
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
