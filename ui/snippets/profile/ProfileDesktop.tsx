import { PopoverBody, PopoverContent, PopoverTrigger, useDisclosure, type ButtonProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import Popover from 'ui/shared/chakra/Popover';
import AuthModal from 'ui/snippets/auth/AuthModal';
import useSignInWithWallet from 'ui/snippets/auth/useSignInWithWallet';

import ProfileButton from './ProfileButton';
import ProfileMenuContent from './ProfileMenuContent';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const ProfileDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
  const router = useRouter();

  const authModal = useDisclosure();
  const profileMenu = useDisclosure();

  const profileQuery = useFetchProfileInfo();
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

  return (
    <>
      <Popover openDelay={ 300 } placement="bottom-end" isLazy isOpen={ profileMenu.isOpen } onClose={ profileMenu.onClose }>
        <PopoverTrigger>
          <ProfileButton
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
              <ProfileMenuContent data={ profileQuery.data } onClose={ profileMenu.onClose }/>
            </PopoverBody>
          </PopoverContent>
        ) }
      </Popover>
      { authModal.isOpen && <AuthModal onClose={ authModal.onClose } initialScreen={{ type: 'select_method' }}/> }
    </>
  );
};

export default React.memo(ProfileDesktop);
