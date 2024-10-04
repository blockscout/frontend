import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, IconButton } from '@chakra-ui/react';
import type { IconButtonProps } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import useLoginUrl from 'lib/hooks/useLoginUrl';
import * as mixpanel from 'lib/mixpanel/index';
import UserAvatar from 'ui/shared/UserAvatar';
import ProfileMenuContent from 'ui/snippets/profileMenu/ProfileMenuContent';

const ProfileMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, error, isPending } = useFetchProfileInfo();
  const loginUrl = useLoginUrl();
  const [ hasMenu, setHasMenu ] = React.useState(false);

  const handleSignInClick = React.useCallback(() => {
    mixpanel.logEvent(
      mixpanel.EventTypes.ACCOUNT_ACCESS,
      { Action: 'Auth0 init' },
      { send_immediately: true },
    );
  }, []);

  React.useEffect(() => {
    if (!isPending) {
      setHasMenu(Boolean(data));
    }
  }, [ data, error?.status, isPending ]);

  const iconButtonProps: Partial<IconButtonProps> = (() => {
    if (hasMenu || !loginUrl) {
      return {};
    }

    return {
      as: 'a',
      href: loginUrl,
      onClick: handleSignInClick,
    };
  })();

  return (
    <>
      <IconButton
        aria-label="profile menu"
        icon={ <UserAvatar size={ 20 }/> }
        variant="header"
        data-selected={ hasMenu }
        boxSize="40px"
        flexShrink={ 0 }
        onClick={ hasMenu ? onOpen : undefined }
        { ...iconButtonProps }
      />
      { hasMenu && (
        <Drawer
          isOpen={ isOpen }
          placement="right"
          onClose={ onClose }
          autoFocus={ false }
        >
          <DrawerOverlay/>
          <DrawerContent maxWidth="300px">
            <DrawerBody p={ 6 }>
              <ProfileMenuContent data={ data } onNavLinkClick={ onClose }/>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
    </>
  );
};

export default ProfileMenuMobile;
