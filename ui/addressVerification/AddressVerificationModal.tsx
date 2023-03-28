import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { AddressVerificationFormFields } from './types';

import Web3ModalProvider from 'ui/shared/Web3ModalProvider';

import AddressVerificationStepAddress from './steps/AddressVerificationStepAddress';
import AddressVerificationStepSignature from './steps/AddressVerificationStepSignature';
import AddressVerificationStepSuccess from './steps/AddressVerificationStepSuccess';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddressVerificationModal = ({ isOpen, onClose }: Props) => {
  const [ stepIndex, setStepIndex ] = React.useState(0);

  const formApi = useForm<AddressVerificationFormFields>({
    mode: 'onBlur',
  });
  const { handleSubmit } = formApi;

  const handleGoToNextStep = React.useCallback(() => {
    setStepIndex((prev) => prev + 1);
  }, []);

  const handleClose = React.useCallback(() => {
    onClose();
    setStepIndex(0);
    formApi.reset();
  }, [ formApi, onClose ]);

  const onFormSubmit: SubmitHandler<AddressVerificationFormFields> = React.useCallback(async(data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);
  }, [ ]);

  const onSubmit = handleSubmit(onFormSubmit);

  const steps = [
    { title: 'Verify new address ownership', content: <AddressVerificationStepAddress onContinue={ handleGoToNextStep }/> },
    { title: 'Copy message to sign', content: <AddressVerificationStepSignature onContinue={ handleGoToNextStep } onSubmit={ onSubmit }/> },
    { title: 'Congrats! Address is verified.', content: <AddressVerificationStepSuccess onShowListClick={ handleClose } onAddTokenClick={ handleClose }/> },
  ];
  const step = steps[stepIndex];

  return (
    <Modal isOpen={ isOpen } onClose={ handleClose } size={{ base: 'full', lg: 'md' }}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3" mb={ 6 }>{ step.title }</ModalHeader>
        <ModalCloseButton/>
        <ModalBody mb={ 0 }>
          <Web3ModalProvider>
            <FormProvider { ...formApi }>
              <form noValidate onSubmit={ onSubmit }>
                { step.content }
              </form>
            </FormProvider>
          </Web3ModalProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(AddressVerificationModal);
