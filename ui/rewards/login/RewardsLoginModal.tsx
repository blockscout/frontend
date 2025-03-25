import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

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

  const [ isLoginStep, setIsLoginStep ] = useState(true);
  const [ isReferral, setIsReferral ] = useState(false);
  const [ customReferralReward, setCustomReferralReward ] = useState<string | null>(null);
  const [ authModalInitialScreen, setAuthModalInitialScreen ] = useState<Screen>();
  const authModal = useDisclosure();

  useEffect(() => {
    if (!isLoginModalOpen) {
      setIsLoginStep(true);
      setIsReferral(false);
      setCustomReferralReward(null);
    }
  }, [ isLoginModalOpen ]);

  const goNext = useCallback((isReferral: boolean, reward: string | null) => {
    setIsReferral(isReferral);
    setCustomReferralReward(reward);
    setIsLoginStep(false);
  }, []);

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
              <CongratsStepContent isReferral={ isReferral } customReferralReward={ customReferralReward }/>
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
