import { Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, Button } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isFetched } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();

  return (
    <>
      <Box padding={ 2 } onClick={ onOpen }>
        <UserAvatar size={ 24 } data={ data } isFetched={ isFetched }/>
      </Box>
      <Drawer
        isOpen={ isOpen }
        placement="right"
        onClose={ onClose }
        autoFocus={ false }
      >
        <DrawerOverlay/>
        <DrawerContent maxWidth="260px">
          <DrawerBody p={ 6 }>
            <Box onClick={ onClose } mb={ 6 }>
              <UserAvatar size={ 24 } data={ data } isFetched={ isFetched }/>
            </Box>
            { data ? <ProfileMenuContent { ...data }/> : (
              <Button size="sm" width="full" variant="outline" as="a" href={ loginUrl }>Sign In</Button>
            ) }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProfileMenuMobile;
