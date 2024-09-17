import { useDisclosure, type ButtonProps } from '@chakra-ui/react';
import React from 'react';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import AuthModal from 'ui/snippets/auth/AuthModal';

import ProfileButton from './ProfileButton';

interface Props {
  buttonSize?: ButtonProps['size'];
  isHomePage?: boolean;
}

const ProfileDesktop = ({ buttonSize, isHomePage }: Props) => {
  const profileQuery = useFetchProfileInfo();
  const authModal = useDisclosure();

  return (
    <>
      <ProfileButton
        profileQuery={ profileQuery }
        size={ buttonSize }
        variant={ isHomePage ? 'hero' : 'header' }
        onClick={ authModal.onOpen }
      />
      { authModal.isOpen && <AuthModal onClose={ authModal.onClose } initialScreen={{ type: 'select_method' }}/> }
    </>
  );
};

export default React.memo(ProfileDesktop);
