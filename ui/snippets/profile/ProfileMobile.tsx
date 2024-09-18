import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import AuthModal from 'ui/snippets/auth/AuthModal';

import ProfileButton from './ProfileButton';
import ProfileMenuContent from './ProfileMenuContent';

const ProfileMobile = () => {
  const profileQuery = useFetchProfileInfo();
  const authModal = useDisclosure();
  const profileMenu = useDisclosure();

  return (
    <>
      <ProfileButton
        profileQuery={ profileQuery }
        variant="header"
        onClick={ profileQuery.data ? profileMenu.onOpen : authModal.onOpen }
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
