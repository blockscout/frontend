import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useBoolean, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';

import type { Screen } from 'ui/snippets/auth/types';

import { useRewardsContext } from 'lib/contexts/rewards';
import useIsMobile from 'lib/hooks/useIsMobile';
import useWallet from 'lib/web3/useWallet';
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
  const isMobile = useIsMobile();
  const { isLoginModalOpen, closeLoginModal } = useRewardsContext();

  const [ isLoginStep, setIsLoginStep ] = useBoolean(true);
  const [ isReferral, setIsReferral ] = useBoolean(false);
  const [ authModalInitialScreen, setAuthModalInitialScreen ] = React.useState<Screen>();
  const authModal = useDisclosure();

  useEffect(() => {
    if (!isLoginModalOpen) {
      setIsLoginStep.on();
      setIsReferral.off();
    }
  }, [ isLoginModalOpen, setIsLoginStep, setIsReferral ]);

  const goNext = useCallback((isReferral: boolean) => {
    if (isReferral) {
      setIsReferral.on();
    }
    setIsLoginStep.off();
  }, [ setIsLoginStep, setIsReferral ]);

  const handleAuthModalOpen = useCallback((isAuth: boolean, trySharedLogin?: boolean) => {
    setAuthModalInitialScreen({ type: 'connect_wallet', isAuth, loginToRewards: trySharedLogin });
    authModal.onOpen();
  }, [ authModal, setAuthModalInitialScreen ]);

  const handleAuthModalClose = useCallback((isSuccess?: boolean, rewardsApiToken?: string) => {
    if (isSuccess && rewardsApiToken) {
      closeLoginModal();
    }
    setAuthModalInitialScreen(undefined);
    authModal.onClose();
  }, [ authModal, setAuthModalInitialScreen, closeLoginModal ]);

  return (
    <>
      <Modal
        isOpen={ isLoginModalOpen && !isWalletModalOpen && !authModal.isOpen }
        onClose={ closeLoginModal }
        size={ isMobile ? 'full' : 'sm' }
        isCentered
      >
        <ModalOverlay/>
        <ModalContent width={ isLoginStep ? '400px' : '560px' } p={ 6 }>
          <ModalHeader fontWeight="500" textStyle="h3" mb={ 3 }>
            { isLoginStep ? 'Login' : 'Congratulations' }
          </ModalHeader>
          <ModalCloseButton top={ 6 } right={ 6 }/>
          <ModalBody mb={ 0 }>
            { isLoginStep ?
              <LoginStepContent goNext={ goNext } openAuthModal={ handleAuthModalOpen } closeModal={ closeLoginModal }/> :
              <CongratsStepContent isReferral={ isReferral }/>
            }
          </ModalBody>
        </ModalContent>
      </Modal>
      { authModal.isOpen && authModalInitialScreen && (
        <AuthModal
          onClose={ handleAuthModalClose }
          initialScreen={ authModalInitialScreen }
          mixpanelConfig={ MIXPANEL_CONFIG }
          closeOnError
        />
      ) }
    </>
  );
};

export default RewardsLoginModal;
