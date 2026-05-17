import { useRouter } from 'next/router';
import React from 'react';

import type { Screen } from 'ui/snippets/auth/types';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel';
import useAccount from 'lib/web3/useAccount';
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'toolkit/chakra/drawer';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import AuthModal from 'ui/snippets/auth/AuthModal';
import { redirectToAuthProvider } from 'ui/snippets/auth/redirectToAuthProvider';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

import UserProfileButton from './UserProfileButton';
import UserProfileContent from './UserProfileContent';

const initialScreen = {
  type: config.features.blockchainInteraction.isEnabled ? 'select_method' as const : 'email' as const,
};

const UserProfileMobile = () => {
  const [ authInitialScreen, setAuthInitialScreen ] = React.useState<Screen>(initialScreen);
  const router = useRouter();

  const authModal = useDisclosure();
  const profileMenu = useDisclosure();

  const profileQuery = useProfileQuery();
  const { address: web3Address } = useAccount();

  const handleProfileButtonClick = React.useCallback(() => {
    if (profileQuery.data || web3Address) {
      mixpanel.logEvent(mixpanel.EventTypes.ACCOUNT_ACCESS, { Action: 'Dropdown open' });
      profileMenu.onOpen();
      return;
    }

    if (router.pathname === '/apps/[id]' && config.features.blockchainInteraction.isEnabled) {
      setAuthInitialScreen({ type: 'connect_wallet', loginToRewards: true });
    }

    if (redirectToAuthProvider(router.asPath)) {
      return;
    }

    authModal.onOpen();
  }, [ profileQuery.data, web3Address, router.asPath, router.pathname, authModal, profileMenu ]);

  const handleAddEmailClick = React.useCallback(() => {
    if (redirectToAuthProvider(router.asPath)) {
      profileMenu.onClose();
      return;
    }

    setAuthInitialScreen({ type: 'email', isAuth: true });
    authModal.onOpen();
    profileMenu.onClose();
  }, [ authModal, profileMenu, router.asPath ]);

  const handleAddAddressClick = React.useCallback(() => {
    if (redirectToAuthProvider(router.asPath)) {
      profileMenu.onClose();
      return;
    }

    setAuthInitialScreen({ type: 'connect_wallet', isAuth: true, loginToRewards: true });
    authModal.onOpen();
    profileMenu.onClose();
  }, [ authModal, profileMenu, router.asPath ]);

  const handleAuthModalClose = React.useCallback(() => {
    setAuthInitialScreen(initialScreen);
    authModal.onClose();
  }, [ authModal ]);

  const handleLoginClick = React.useCallback(() => {
    if (redirectToAuthProvider(router.asPath)) {
      profileMenu.onClose();
      return;
    }

    authModal.onOpen();
    profileMenu.onClose();
  }, [ authModal, profileMenu, router.asPath ]);

  const handleProfileMenuOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    !open && profileMenu.onOpenChange({ open });
  }, [ profileMenu ]);

  return (
    <>
      <DrawerRoot
        open={ profileMenu.open }
        onOpenChange={ handleProfileMenuOpenChange }
      >
        <DrawerTrigger>
          <UserProfileButton
            profileQuery={ profileQuery }
            variant="header"
            onClick={ handleProfileButtonClick }
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerBody>
            <UserProfileContent
              data={ profileQuery.data }
              onClose={ profileMenu.onClose }
              onLogin={ handleLoginClick }
              onAddEmail={ handleAddEmailClick }
              onAddAddress={ handleAddAddressClick }
            />
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
      { authModal.open && (
        <AuthModal
          onClose={ handleAuthModalClose }
          initialScreen={ authInitialScreen }
        />
      ) }
    </>
  );
};

export default React.memo(UserProfileMobile);
