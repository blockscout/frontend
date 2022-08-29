import { Flex, Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { UserInfo } from 'types/api/account';

import ColorModeToggler from 'ui/blocks/header/ColorModeToggler';
import ProfileMenuContent from 'ui/blocks/profileMenu/ProfileMenuContent';
import UserAvatar from 'ui/shared/UserAvatar';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data } = useQuery<unknown, unknown, UserInfo>([ 'profile' ], async() => {
    const response = await fetch('/api/account/profile');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

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
