import { Flex, Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, Button } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import link from 'lib/link/link';
import UserAvatar from 'ui/shared/UserAvatar';
import ColorModeToggler from 'ui/snippets/header/ColorModeToggler';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data } = useFetchProfileInfo();
  const loginUrl = link('auth');

  return (
    <>
      <Box padding={ 2 } onClick={ onOpen }>
        <UserAvatar size={ 24 } data={ data }/>
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
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb={ 6 }
            >
              <ColorModeToggler/>
              <Box onClick={ onClose }>
                <UserAvatar size={ 24 } data={ data }/>
              </Box>
            </Flex>
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
