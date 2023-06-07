import { Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, Button } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, error } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();

  const buttonProps: Partial<ButtonProps> = (() => {
    if (error?.status === 403) {
      return {
        as: 'a',
        href: route({ pathname: '/auth/profile' }),
      };
    }

    if (!data) {
      return {
        as: 'a',
        href: loginUrl,
      };
    }

    return {};
  })();

  return (
    <>
      <Box padding={ 2 } onClick={ data ? onOpen : undefined }>
        <Button
          variant="unstyled"
          height="auto"
          { ...buttonProps }
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
