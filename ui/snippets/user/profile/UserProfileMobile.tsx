import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { Screen } from 'ui/snippets/auth/types';

import config from 'configs/app';
import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import AuthModal from 'ui/snippets/auth/AuthModal';
import useSignInWithWallet from 'ui/snippets/auth/useSignInWithWallet';

import UserProfileButton from './UserProfileButton';
import UserProfileContent from './UserProfileContent';

const UserProfileMobile = () => {
  const [ authInitialScreen, setAuthInitialScreen ] = React.useState<Screen>({
    type: config.features.blockchainInteraction.isEnabled ? 'select_method' : 'email',
  });
  const router = useRouter();

  const authModal = useDisclosure();
  const profileMenu = useDisclosure();

  const profileQuery = useFetchProfileInfo();
  const signInWithWallet = useSignInWithWallet({});

  const handleProfileButtonClick = React.useCallback(() => {
    if (profileQuery.data) {
      profileMenu.onOpen();
      return;
    }

    if (router.pathname === '/apps/[id]') {
      signInWithWallet.start();
      return;
    }

    authModal.onOpen();
  }, [ profileQuery.data, router.pathname, authModal, profileMenu, signInWithWallet ]);

  const handleAddEmailClick = React.useCallback(() => {
    setAuthInitialScreen({ type: 'email', isAuth: true });
    authModal.onOpen();
  }, [ authModal ]);

  return (
    <>
      <UserProfileButton
        profileQuery={ profileQuery }
        variant="header"
        onClick={ handleProfileButtonClick }
      />
      { profileQuery.data && (
        <Drawer
          isOpen={ profileMenu.isOpen }
          placement="right"
          onClose={ profileMenu.onClose }
          autoFocus={ false }
        >
          <DrawerOverlay/>
          <DrawerContent maxWidth="300px">
            <DrawerBody p={ 6 }>
              <UserProfileContent data={ profileQuery.data } onClose={ profileMenu.onClose } onAddEmail={ handleAddEmailClick }/>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
      { authModal.isOpen && (
        <AuthModal
          onClose={ authModal.onClose }
          initialScreen={ authInitialScreen }
        />
      ) }
    </>
  );
};

export default React.memo(UserProfileMobile);
