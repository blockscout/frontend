import { Box, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, Button } from '@chakra-ui/react';
import type { ButtonProps } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, error, isLoading } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();
  const [ hasMenu, setHasMenu ] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      setHasMenu(Boolean(data) || error?.status === 403);
    }
  }, [ data, error?.status, isLoading ]);

  const buttonProps: Partial<ButtonProps> = (() => {
    if (hasMenu) {
      return {};
    }

    return {
      as: 'a',
      href: loginUrl,
    };
  })();

  return (
    <>
      <Box padding={ 2 } onClick={ hasMenu ? onOpen : undefined }>
        <Button
          variant="unstyled"
          height="auto"
          { ...buttonProps }
        >
          <UserAvatar size={ 24 }/>
        </Button>
      </Box>
      { hasMenu && (
        <Drawer
          isOpen={ isOpen }
          placement="right"
          onClose={ onClose }
          autoFocus={ false }
        >
          <DrawerOverlay/>
          <DrawerContent maxWidth="260px">
            <DrawerBody p={ 6 }>
              <ProfileMenuContent data={ data }/>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
    </>
  );
};

export default ProfileMenuMobile;
