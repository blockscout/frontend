import { PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, type ButtonProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { Screen } from 'ui/snippets/auth/types';

import config from 'configs/app';
import Popover from 'ui/shared/chakra/Popover';
import AuthModal from 'ui/snippets/auth/AuthModal';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';
import useSignInWithWallet from 'ui/snippets/auth/useSignInWithWallet';

import UserProfileButton from './UserProfileButton';
import UserProfileContent from './UserProfileContent';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const UserProfileDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  const [ authInitialScreen, setAuthInitialScreen ] = React.useState<Screen>({
    type: config.features.blockchainInteraction.isEnabled ? 'select_method' : 'email',
  });
  const router = useRouter();

  const authModal = useDisclosure();
  const profileMenu = useDisclosure();

  const profileQuery = useProfileQuery();
  const signInWithWallet = useSignInWithWallet({});

  const handleProfileButtonClick = React.useCallback(() => {
    if (profileQuery.data) {
      profileMenu.onOpen();
      return;
    }

    if (router.pathname === '/apps/[id]') {
      signInWithWallet.start();
      return;
    }

    authModal.onOpen();
  }, [ profileQuery.data, router.pathname, authModal, profileMenu, signInWithWallet ]);

  const handleAddEmailClick = React.useCallback(() => {
    setAuthInitialScreen({ type: 'email', isAuth: true });
    authModal.onOpen();
  }, [ authModal ]);

  return (
    <>
      <Popover openDelay={ 300 } placement="bottom-end" isLazy isOpen={ profileMenu.isOpen } onClose={ profileMenu.onClose }>
        <PopoverTrigger>
          <UserProfileButton
            profileQuery={ profileQuery }
            size={ buttonSize }
            variant={ buttonVariant }
            onClick={ handleProfileButtonClick }
            isPending={ signInWithWallet.isPending }
          />
        </PopoverTrigger>
        { profileQuery.data && (
          <PopoverContent maxW="280px" minW="220px" w="min-content">
            <PopoverBody>
              <UserProfileContent data={ profileQuery.data } onClose={ profileMenu.onClose } onAddEmail={ handleAddEmailClick }/>
            </PopoverBody>
          </PopoverContent>
        ) }
      </Popover>
      { authModal.isOpen && (
        <AuthModal
          onClose={ authModal.onClose }
          initialScreen={ authInitialScreen }
        />
      ) }
    </>
  );
};

export default React.memo(UserProfileDesktop);
