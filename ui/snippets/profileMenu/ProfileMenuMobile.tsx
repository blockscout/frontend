import { Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, Button } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();

  return (
    <>
      <Box padding={ 2 } onClick={ data ? onOpen : undefined }>
        <Button
          variant="unstyled"
          height="auto"
          as={ data ? undefined : 'a' }
          href={ data ? undefined : loginUrl }
        >
          <UserAvatar size={ 24 }/>
        </Button>
      </Box>
      { data && (
        <Drawer
          isOpen={ isOpen }
          placement="right"
          onClose={ onClose }
          autoFocus={ false }
        >
          <DrawerOverlay/>
          <DrawerContent maxWidth="260px">
            <DrawerBody p={ 6 }>
              <ProfileMenuContent { ...data }/>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
    </>
  );
};

export default ProfileMenuMobile;
