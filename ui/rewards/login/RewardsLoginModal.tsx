import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useBoolean, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';

import { useRewardsContext } from 'lib/contexts/rewards';
import useIsMobile from 'lib/hooks/useIsMobile';
import useWallet from 'lib/web3/useWallet';
import AuthModal from 'ui/snippets/auth/AuthModal';

import CongratsStepContent from './steps/CongratsStepContent';
import LoginStepContent from './steps/LoginStepContent';

const RewardsLoginModal = () => {
  const { isOpen: isWalletModalOpen } = useWallet({ source: 'Merits' });
  const isMobile = useIsMobile();
  const { isLoginModalOpen, closeLoginModal } = useRewardsContext();

  const [ isLoginStep, setIsLoginStep ] = useBoolean(true);
  const [ isReferral, setIsReferral ] = useBoolean(false);
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
              <LoginStepContent goNext={ goNext } openAuthModal={ authModal.onOpen } closeModal={ closeLoginModal }/> :
              <CongratsStepContent isReferral={ isReferral }/>
            }
          </ModalBody>
        </ModalContent>
      </Modal>
      { authModal.isOpen && (
        <AuthModal
          onClose={ authModal.onClose }
          initialScreen={{ type: 'connect_wallet' }}
          closeOnError
        />
      ) }
    </>
  );
};

export default RewardsLoginModal;
