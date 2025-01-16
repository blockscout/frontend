import React, { useCallback, useEffect } from 'react';

import { useRewardsContext } from 'lib/contexts/rewards';
import useWallet from 'lib/web3/useWallet';
import { DialogBody, DialogContent, DialogRoot, DialogHeader } from 'toolkit/chakra/dialog';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import AuthModal from 'ui/snippets/auth/AuthModal';

import CongratsStepContent from './steps/CongratsStepContent';
import LoginStepContent from './steps/LoginStepContent';

const MIXPANEL_CONFIG = {
  account_link_info: {
    source: 'Merits' as const,
  },
  wallet_connect: {
    source: 'Merits' as const,
  },
};

const RewardsLoginModal = () => {
  const { isOpen: isWalletModalOpen } = useWallet({ source: 'Merits' });
  const { isLoginModalOpen, closeLoginModal, openLoginModal } = useRewardsContext();

  const [ isLoginStep, setIsLoginStep ] = React.useState(true);
  const [ isReferral, setIsReferral ] = React.useState(false);
  const [ isAuth, setIsAuth ] = React.useState(false);
  const authModal = useDisclosure();

  useEffect(() => {
    if (!isLoginModalOpen) {
      setIsLoginStep(true);
      setIsReferral(false);
    }
  }, [ isLoginModalOpen, setIsLoginStep, setIsReferral ]);

  const goNext = useCallback((isReferral: boolean) => {
    if (isReferral) {
      setIsReferral(true);
    }
    setIsLoginStep(false);
  }, [ setIsLoginStep, setIsReferral ]);

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (open) {
      openLoginModal();
    } else {
      closeLoginModal();
    }
  }, [ closeLoginModal, openLoginModal ]);

  const handleAuthModalOpen = useCallback((isAuth: boolean) => {
    setIsAuth(isAuth);
    authModal.onOpen();
  }, [ authModal, setIsAuth ]);

  const handleAuthModalClose = useCallback(() => {
    setIsAuth(false);
    authModal.onClose();
  }, [ authModal, setIsAuth ]);

  return (
    <>
      <DialogRoot
        open={ isLoginModalOpen && !isWalletModalOpen && !authModal.open }
        onOpenChange={ handleOpenChange }
        size={{ base: 'full', lg: isLoginStep ? 'sm' : 'md' }}
      >
        <DialogContent>
          <DialogHeader>
            { isLoginStep ? 'Login' : 'Congratulations' }
          </DialogHeader>
          <DialogBody>
            { isLoginStep ?
              <LoginStepContent goNext={ goNext } openAuthModal={ handleAuthModalOpen } closeModal={ closeLoginModal }/> :
              <CongratsStepContent isReferral={ isReferral }/>
            }
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      { authModal.open && (
        <AuthModal
          onClose={ handleAuthModalClose }
          initialScreen={{ type: 'connect_wallet', isAuth }}
          mixpanelConfig={ MIXPANEL_CONFIG }
          closeOnError
        />
      ) }
    </>
  );
};

export default RewardsLoginModal;
