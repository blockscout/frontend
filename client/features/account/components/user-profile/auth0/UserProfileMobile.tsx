// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { Screen } from 'client/features/account/components/auth-modal/types';

import AuthModal from 'client/features/account/components/auth-modal/AuthModal';
import useProfileQuery from 'client/features/account/hooks/useProfileQuery';
import useAccount from 'client/features/connect-wallet/hooks/useAccount';

import * as mixpanel from 'client/shared/analytics/mixpanel';

import config from 'configs/app';
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'toolkit/chakra/drawer';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

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

    authModal.onOpen();
  }, [ profileQuery.data, web3Address, router.pathname, authModal, profileMenu ]);

  const handleAddEmailClick = React.useCallback(() => {
    setAuthInitialScreen({ type: 'email', isAuth: true });
    authModal.onOpen();
    profileMenu.onClose();
  }, [ authModal, profileMenu ]);

  const handleAddAddressClick = React.useCallback(() => {
    setAuthInitialScreen({ type: 'connect_wallet', isAuth: true, loginToRewards: true });
    authModal.onOpen();
    profileMenu.onClose();
  }, [ authModal, profileMenu ]);

  const handleAuthModalClose = React.useCallback(() => {
    setAuthInitialScreen(initialScreen);
    authModal.onClose();
  }, [ authModal ]);

  const handleLoginClick = React.useCallback(() => {
    authModal.onOpen();
    profileMenu.onClose();
  }, [ authModal, profileMenu ]);

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
