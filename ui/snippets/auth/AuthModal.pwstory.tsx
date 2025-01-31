import { Box, Button, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import AuthModal from './AuthModal';
import useIsAuth from './useIsAuth';

interface Props {
  flow: 'email_login' | 'email_link';
}

const AuthModalStory = ({ flow }: Props) => {
  const authModal = useDisclosure();
  const isAuth = useIsAuth();

  const initialScreen = flow === 'email_login' ? { type: 'select_method' as const } : { type: 'email' as const, isAuth: true };

  const handleClose = React.useCallback(() => {
    authModal.onClose();
  }, [ authModal ]);

  return (
    <>
      <Button onClick={ authModal.onOpen }>{ flow === 'email_login' ? 'Log in' : 'Link email' }</Button>
      { authModal.isOpen && <AuthModal initialScreen={ initialScreen } onClose={ handleClose }/> }
      <Box>Status: { isAuth ? 'Authenticated' : 'Not authenticated' }</Box>
    </>
  );
};

export default AuthModalStory;
