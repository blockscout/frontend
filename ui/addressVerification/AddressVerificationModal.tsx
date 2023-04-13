import { Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Link } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { AddressVerificationFormFirstStepFields, AddressCheckStatusSuccess } from './types';
import type { VerifiedAddress, VerifiedAddressResponse } from 'types/api/account';

import appConfig from 'configs/app/config';
import eastArrowIcon from 'icons/arrows/east.svg';
import { getResourceKey } from 'lib/api/useApiQuery';
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
  const [ data, setData ] = React.useState<AddressVerificationFormFirstStepFields & AddressCheckStatusSuccess>({ address: '', signingMessage: '' });

  const queryClient = useQueryClient();

  const handleGoToSecondStep = React.useCallback((firstStepResult: typeof data) => {
    setData(firstStepResult);
    setStepIndex((prev) => prev + 1);
  }, []);

  const handleGoToThirdStep = React.useCallback((newItem: VerifiedAddress) => {
    queryClient.setQueryData(
      getResourceKey('verified_addresses', { pathParams: { chainId: appConfig.network.id } }),
      (prevData: VerifiedAddressResponse | undefined) => {
        if (!prevData) {
          return { verifiedAddresses: [ newItem ] };
        }

        return {
          verifiedAddresses: [ newItem, ...prevData.verifiedAddresses ],
        };
      });
    setStepIndex((prev) => prev + 1);
  }, [ queryClient ]);

  const handleGoToPrevStep = React.useCallback(() => {
    setStepIndex((prev) => prev - 1);
  }, []);

  const handleClose = React.useCallback(() => {
    onClose();
    setStepIndex(0);
  }, [ onClose ]);

  const steps = [
    { title: 'Verify new address ownership', content: <AddressVerificationStepAddress onContinue={ handleGoToSecondStep }/> },
    { title: 'Copy and sign message', content: <AddressVerificationStepSignature { ...data } onContinue={ handleGoToThirdStep }/> },
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
            { step.content }
          </Web3ModalProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(AddressVerificationModal);
