import { Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Alert, Link } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { AddressVerificationFormFields } from './types';

import appConfig from 'configs/app/config';
import eastArrowIcon from 'icons/arrows/east.svg';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
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
  const [ error, setError ] = React.useState('');

  const apiFetch = useApiFetch();
  const formApi = useForm<AddressVerificationFormFields>({
    mode: 'onBlur',
  });
  const { handleSubmit } = formApi;

  const handleGoToNextStep = React.useCallback(() => {
    setStepIndex((prev) => prev + 1);
  }, []);

  const handleGoToPrevStep = React.useCallback(() => {
    setStepIndex((prev) => prev - 1);
  }, []);

  const handleClose = React.useCallback(() => {
    onClose();
    setStepIndex(0);
    formApi.reset();
  }, [ formApi, onClose ]);

  const handleSignClick = React.useCallback(() => {
    setError('');
  }, []);

  const onFormSubmit: SubmitHandler<AddressVerificationFormFields> = React.useCallback(async(data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);
    const body = {
      contractAddress: data.address,
      message: data.message,
      signature: data.signature,
    };

    try {
      await apiFetch('address_verification', {
        fetchParams: { method: 'POST', body },
        pathParams: { chainId: appConfig.network.id },
      });
    } catch (error: unknown) {
      const _error = error as ResourceError<{message: string}>;
      setError(_error.payload?.message || 'Oops! Something went wrong');
    }
  }, [ apiFetch ]);

  const onSubmit = handleSubmit(onFormSubmit);

  const steps = [
    { title: 'Verify new address ownership', content: <AddressVerificationStepAddress onContinue={ handleGoToNextStep }/> },
    { title: 'Sign message', content: <AddressVerificationStepSignature onSubmit={ onSubmit } onSign={ handleSignClick }/> },
    { title: 'Congrats! Address is verified.', content: <AddressVerificationStepSuccess onShowListClick={ handleClose } onAddTokenClick={ handleClose }/> },
  ];
  const step = steps[stepIndex];

  return (
    <Modal isOpen={ isOpen } onClose={ handleClose } size={{ base: 'full', lg: 'md' }}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3" mb={ 6 }>
          { stepIndex !== 0 && (
            <Link mr={ 3 } onClick={ handleGoToPrevStep }>
              <Icon as={ eastArrowIcon } boxSize={ 6 } transform="rotate(180deg)" verticalAlign="middle"/>
            </Link>
          ) }
          <span>{ step.title }</span>
        </ModalHeader>
        <ModalCloseButton/>
        <ModalBody mb={ 0 }>
          <Web3ModalProvider>
            <FormProvider { ...formApi }>
              <form noValidate onSubmit={ onSubmit }>
                { error && <Alert status="warning" mb={ 6 }>{ error }</Alert> }
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
