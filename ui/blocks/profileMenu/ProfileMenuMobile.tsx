import { Flex, Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import ColorModeToggler from 'ui/blocks/header/ColorModeToggler';
import ProfileMenuContent from 'ui/blocks/profileMenu/ProfileMenuContent';
import UserAvatar from 'ui/shared/UserAvatar';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box padding={ 2 } onClick={ onOpen }>
        <UserAvatar size={ 24 }/>
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
                <UserAvatar size={ 24 }/>
              </Box>
            </Flex>
            <ProfileMenuContent/>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProfileMenuMobile;
