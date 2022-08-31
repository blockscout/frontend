import { Flex, Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import ColorModeToggler from 'ui/blocks/header/ColorModeToggler';
import ProfileMenuContent from 'ui/blocks/profileMenu/ProfileMenuContent';
import UserAvatar from 'ui/shared/UserAvatar';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data } = useFetchProfileInfo();

  return (
    <>
      <Box padding={ 2 } onClick={ onOpen }>
        <UserAvatar size={ 24 } data={ data }/>
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
              <ProfileMenuContent { ...data }/>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
    </>
  );
};

export default ProfileMenuMobile;
