import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';

import type { Screen, ScreenSuccess } from './types';

import useFetchProfileInfo from 'lib/hooks/useFetchProfileInfo';
import IconSvg from 'ui/shared/IconSvg';

import AuthModalScreenConnectWallet from './screens/AuthModalScreenConnectWallet';
import AuthModalScreenEmail from './screens/AuthModalScreenEmail';
import AuthModalScreenOtpCode from './screens/AuthModalScreenOtpCode';
import AuthModalScreenSelectMethod from './screens/AuthModalScreenSelectMethod';
import AuthModalScreenSuccessEmail from './screens/AuthModalScreenSuccessEmail';
import AuthModalScreenSuccessWallet from './screens/AuthModalScreenSuccessWallet';

interface Props {
  initialScreen: Screen;
  onClose: () => void;
}

const AuthModal = ({ initialScreen, onClose }: Props) => {
  const [ steps, setSteps ] = React.useState<Array<Screen>>([ initialScreen ]);
  const profileQuery = useFetchProfileInfo();

  const onNextStep = React.useCallback((screen: Screen) => {
    setSteps((prev) => [ ...prev, screen ]);
  }, []);

  const onPrevStep = React.useCallback(() => {
    setSteps((prev) => prev.length > 1 ? prev.slice(0, -1) : prev);
  }, []);

  const onReset = React.useCallback((isAuth?: boolean) => {
    isAuth ? onClose() : setSteps([ initialScreen ]);
  }, [ initialScreen, onClose ]);

  const onAuthSuccess = React.useCallback(async(screen: ScreenSuccess) => {
    const { data } = await profileQuery.refetch();
    if (data) {
      onNextStep({ ...screen, profile: data });
    }
    // TODO @tom2drum handle error case
  }, [ onNextStep, profileQuery ]);

  const header = (() => {
    const currentStep = steps[steps.length - 1];
    switch (currentStep.type) {
      case 'select_method':
        return 'Select a way to connect';
      case 'connect_wallet':
        return currentStep.isAuth ? 'Add wallet' : 'Continue with wallet';
      case 'email':
        return currentStep.isAuth ? 'Add email' : 'Continue with email';
      case 'otp_code':
        return 'Confirmation code';
      case 'success_email':
      case 'success_wallet':
        return 'Congrats!';
    }
  })();

  const content = (() => {
    const currentStep = steps[steps.length - 1];
    switch (currentStep.type) {
      case 'select_method':
        return <AuthModalScreenSelectMethod onSelectMethod={ onNextStep }/>;
      case 'connect_wallet':
        return <AuthModalScreenConnectWallet onSuccess={ onAuthSuccess } onError={ onReset } isAuth={ currentStep.isAuth }/>;
      case 'email':
        return <AuthModalScreenEmail onSubmit={ onNextStep } isAuth={ currentStep.isAuth }/>;
      case 'otp_code':
        return <AuthModalScreenOtpCode email={ currentStep.email } onSuccess={ onAuthSuccess } isAuth={ currentStep.isAuth }/>;
      case 'success_email':
        return (
          <AuthModalScreenSuccessEmail
            email={ currentStep.email }
            onConnectWallet={ onNextStep }
            isAuth={ currentStep.isAuth }
            profile={ currentStep.profile }
          />
        );
      case 'success_wallet':
        return (
          <AuthModalScreenSuccessWallet
            address={ currentStep.address }
            onAddEmail={ onNextStep }
            isAuth={ currentStep.isAuth }
            profile={ currentStep.profile }
          />
        );
    }
  })();

  return (
    <Modal isOpen onClose={ onClose } size={{ base: 'full', lg: 'sm' }}>
      <ModalOverlay/>
      <ModalContent p={ 6 } maxW={{ lg: '400px' }}>
        <ModalHeader fontWeight="500" textStyle="h3" mb={ 2 } display="flex" alignItems="center" columnGap={ 2 }>
          { steps.length > 1 && !steps[steps.length - 1].type.startsWith('success') && (
            <IconSvg
              name="arrows/east"
              boxSize={ 6 }
              transform="rotate(180deg)"
              color="gray.400"
              flexShrink={ 0 }
              onClick={ onPrevStep }
              cursor="pointer"
            />
          ) }
          { header }
        </ModalHeader>
        <ModalCloseButton top={ 6 } right={ 6 } color="gray.400"/>
        <ModalBody mb={ 0 }>
          { content }
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(AuthModal);
