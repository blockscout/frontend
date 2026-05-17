import { useRouter } from 'next/router';
import React from 'react';

import { useDisclosure } from 'toolkit/hooks/useDisclosure';

import AuthModal from './AuthModal';
import { redirectToAuthProvider } from './redirectToAuthProvider';
import useProfileQuery from './useProfileQuery';

interface InjectedProps {
  onClick: () => void;
}

interface Props {
  children: (props: InjectedProps) => React.ReactNode;
  onAuthSuccess: () => void;
  ensureEmail?: boolean;
}

const AuthGuard = ({ children, onAuthSuccess, ensureEmail }: Props) => {
  const authModal = useDisclosure();
  const profileQuery = useProfileQuery();
  const router = useRouter();

  const handleClick = React.useCallback(() => {
    if (profileQuery.data) {
      if (ensureEmail && !profileQuery.data.email) {
        if (redirectToAuthProvider(router.asPath)) {
          return;
        }
        authModal.onOpen();
      } else {
        onAuthSuccess();
      }
    } else {
      if (redirectToAuthProvider(router.asPath)) {
        return;
      }
      authModal.onOpen();
    }
  }, [ authModal, ensureEmail, profileQuery.data, onAuthSuccess, router.asPath ]);

  const handleModalClose = React.useCallback((isSuccess?: boolean) => {
    if (isSuccess) {
      if (ensureEmail && !profileQuery.data?.email) {
        // If the user has logged in and has not added an email
        // we need to close the modal and open it again
        // so the initial screen will be correct
        authModal.onClose();
        window.setTimeout(() => {
          authModal.onOpen();
        }, 500);
        return;
      }
      onAuthSuccess();
    }
    authModal.onClose();
  }, [ authModal, ensureEmail, profileQuery.data, onAuthSuccess ]);

  return (
    <>
      { children({ onClick: handleClick }) }
      { authModal.open && (
        <AuthModal
          onClose={ handleModalClose }
          initialScreen={ profileQuery.data && !profileQuery.data.email && ensureEmail ? { type: 'email', isAuth: true } : { type: 'select_method' } }
        />
      ) }
    </>
  );
};

export default React.memo(AuthGuard);
