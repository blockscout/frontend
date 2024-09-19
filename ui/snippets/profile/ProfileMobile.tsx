import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import AuthModal from 'ui/snippets/auth/AuthModal';

import useSignInWithWallet from '../auth/screens/useSignInWithWallet';
import ProfileButton from './ProfileButton';
import ProfileMenuContent from './ProfileMenuContent';

const ProfileMobile = () => {
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

  return (
    <>
      <ProfileButton
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
              <ProfileMenuContent data={ profileQuery.data } onClose={ profileMenu.onClose }/>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
      { authModal.isOpen && <AuthModal onClose={ authModal.onClose } initialScreen={{ type: 'select_method' }}/> }
    </>
  );
};

export default React.memo(ProfileMobile);
