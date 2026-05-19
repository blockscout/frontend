// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from 'client/features/account/components/auth-modal/types';

import AccountPageDescription from 'client/features/account/components/AccountPageDescription';
import AuthModal from 'client/features/account/components/auth-modal/AuthModal';
import useProfileQuery from 'client/features/account/hooks/useProfileQuery';
import useRedirectForInvalidAuthToken from 'client/features/account/hooks/useRedirectForInvalidAuthToken';

import config from 'configs/app';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';

import MyProfileEmail from './MyProfileEmail';
import MyProfileWallet from './MyProfileWallet';

const MIXPANEL_CONFIG = {
  wallet_connect: {
    source: 'Profile' as const,
  },
  account_link_info: {
    source: 'Profile' as const,
  },
};

const MyProfile = () => {
  const [ authInitialScreen, setAuthInitialScreen ] = React.useState<Screen>();
  const authModal = useDisclosure();

  const profileQuery = useProfileQuery();
  useRedirectForInvalidAuthToken();

  const handleAddWalletClick = React.useCallback(() => {
    setAuthInitialScreen({ type: 'connect_wallet', isAuth: true, loginToRewards: true });
    authModal.onOpen();
  }, [ authModal ]);

  const content = (() => {
    if (profileQuery.isPending) {
      return <ContentLoader/>;
    }

    if (profileQuery.isError) {
      return <DataFetchAlert/>;
    }

    return (
      <>
        <AccountPageDescription>
          You can add your email to receive watchlist notifications.
          Additionally, you can manage your wallet address and email, which can be used for logging into your Blockscout account.
        </AccountPageDescription>
        <Flex maxW="480px" mt={ 8 } flexDir="column" rowGap={ 12 }>
          <MyProfileEmail profileQuery={ profileQuery }/>
          { config.features.blockchainInteraction.isEnabled &&
            <MyProfileWallet profileQuery={ profileQuery } onAddWallet={ handleAddWalletClick }/> }
        </Flex>
        { authModal.open && authInitialScreen &&
          <AuthModal initialScreen={ authInitialScreen } onClose={ authModal.onClose } mixpanelConfig={ MIXPANEL_CONFIG }/> }
      </>
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
