import { Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Link } from '@chakra-ui/react';
import React from 'react';

import type { AddressVerificationFormFirstStepFields, AddressCheckStatusSuccess } from './types';
import type { VerifiedAddress } from 'types/api/account';

import eastArrowIcon from 'icons/arrows/east.svg';
import Web3ModalProvider from 'ui/shared/Web3ModalProvider';

import AddressVerificationStepAddress from './steps/AddressVerificationStepAddress';
import AddressVerificationStepSignature from './steps/AddressVerificationStepSignature';
import AddressVerificationStepSuccess from './steps/AddressVerificationStepSuccess';

type StateData = AddressVerificationFormFirstStepFields & AddressCheckStatusSuccess & { isToken?: boolean };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: VerifiedAddress) => void;
  onAddTokenInfoClick: (address: string) => void;
  onShowListClick: () => void;
  defaultAddress?: string;
}

const AddressVerificationModal = ({ defaultAddress, isOpen, onClose, onSubmit, onAddTokenInfoClick, onShowListClick }: Props) => {
  const [ stepIndex, setStepIndex ] = React.useState(0);
  const [ data, setData ] = React.useState<StateData>({ address: '', signingMessage: '' });

  const handleGoToSecondStep = React.useCallback((firstStepResult: typeof data) => {
    setData(firstStepResult);
    setStepIndex((prev) => prev + 1);
  }, []);

  const handleGoToThirdStep = React.useCallback((address: VerifiedAddress) => {
    onSubmit(address);
    setStepIndex((prev) => prev + 1);
    setData((prev) => ({ ...prev, isToken: Boolean(address.metadata.tokenName) }));
  }, [ onSubmit ]);

  const handleGoToPrevStep = React.useCallback(() => {
    setStepIndex((prev) => prev - 1);
  }, []);

  const handleClose = React.useCallback(() => {
    onClose();
    setStepIndex(0);
    setData({ address: '', signingMessage: '' });
  }, [ onClose ]);

  const handleAddTokenInfoClick = React.useCallback(() => {
    onAddTokenInfoClick(data.address);
    handleClose();
  }, [ handleClose, data.address, onAddTokenInfoClick ]);

  const steps = [
    {
      title: 'Verify new address ownership',
      content: <AddressVerificationStepAddress onContinue={ handleGoToSecondStep } defaultAddress={ defaultAddress }/>,
    },
    {
      title: 'Copy and sign message',
      content: <AddressVerificationStepSignature { ...data } onContinue={ handleGoToThirdStep }/>,
      fallback: <AddressVerificationStepSignature { ...data } onContinue={ handleGoToThirdStep } noWeb3Provider/>,
    },
    {
      title: 'Congrats! Address is verified.',
      content: (
        <AddressVerificationStepSuccess
          onShowListClick={ onShowListClick }
          onAddTokenInfoClick={ handleAddTokenInfoClick }
          isToken={ data.isToken }
          address={ data.address }
        />
      ),
    },
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
          <Web3ModalProvider fallback={ step?.fallback || step.content }>
            { step.content }
          </Web3ModalProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(AddressVerificationModal);
