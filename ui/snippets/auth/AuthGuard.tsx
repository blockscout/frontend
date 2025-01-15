import React from 'react';

import { useDisclosure } from 'toolkit/hooks/useDisclosure';

import AuthModal from './AuthModal';
import useIsAuth from './useIsAuth';

interface InjectedProps {
  onClick: () => void;
}

interface Props {
  children: (props: InjectedProps) => React.ReactNode;
  onAuthSuccess: () => void;
}

const AuthGuard = ({ children, onAuthSuccess }: Props) => {
  const authModal = useDisclosure();
  const isAuth = useIsAuth();

  const handleClick = React.useCallback(() => {
    isAuth ? onAuthSuccess() : authModal.onOpen();
  }, [ authModal, isAuth, onAuthSuccess ]);

  const handleModalClose = React.useCallback((isSuccess?: boolean) => {
    if (isSuccess) {
      onAuthSuccess();
    }
    authModal.onClose();
  }, [ authModal, onAuthSuccess ]);

  return (
    <>
      { children({ onClick: handleClick }) }
      { authModal.open && <AuthModal onClose={ handleModalClose } initialScreen={{ type: 'select_method' }}/> }
    </>
  );
};

export default React.memo(AuthGuard);
