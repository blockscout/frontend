import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useSignMessage } from 'wagmi';

import type { AddressVerificationFormFields } from '../types';

import useToast from 'lib/hooks/useToast';

import AddressVerificationFieldAddress from '../fields/AddressVerificationFieldAddress';
import AddressVerificationFieldMessage from '../fields/AddressVerificationFieldMessage';
import AddressVerificationFieldSignature from '../fields/AddressVerificationFieldSignature';

interface Props {
  onContinue: () => void;
  onSubmit: () => void;
}

const AddressVerificationStepSignature = ({ onContinue, onSubmit }: Props) => {
  const [ isManualSigning, setIsManualSigning ] = React.useState(false);

  const toast = useToast();
  const { formState, trigger, getValues, setValue } = useFormContext<AddressVerificationFormFields>();
  const { signMessage } = useSignMessage({
    onSuccess: (data) => {
      setValue('signature', data);
      onSubmit();
    },
    onError: (error) => {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    },
  });

  const handleVerifyButtonClick = React.useCallback(() => {
    if (!formState.isValid) {
      trigger('signature');
      trigger('message');
      return;
    }
    onContinue();
  }, [ formState, onContinue, trigger ]);

  const handleWeb3SignClick = React.useCallback(() => {
    const message = getValues('message');
    signMessage({ message });
  }, [ getValues, signMessage ]);

  const handleManualSignClick = React.useCallback(() => {
    setIsManualSigning(true);
  }, []);

  const buttons = isManualSigning ? (
    <>
      <Button size="lg" onClick={ handleVerifyButtonClick }>
          Verify ownership
      </Button>
      <Box>
        <span>Contact </span>
        <Link>support@blockscout.com</Link>
      </Box>
    </>
  ) : (
    <>
      <Button size="lg" onClick={ handleManualSignClick }>
        Sign manually
      </Button>
      <Button size="lg" onClick={ handleWeb3SignClick }>
        Sign via web3 wallet
      </Button>
    </>
  );

  return (
    <Box>
      <Box mb={ 8 }>
        Copy the message below and sign it using the Blockscout sign message provider of your choice.
      </Box>
      <Flex rowGap={ 5 } flexDir="column">
        <AddressVerificationFieldAddress isDisabled/>
        <AddressVerificationFieldMessage isDisabled={ !isManualSigning }/>
        { isManualSigning && <AddressVerificationFieldSignature/> }
      </Flex>
      <Box mt={ 8 }>
        <span>{ `Check our article on "` }</span>
        <Link>How to sign message?</Link>
        <span>{ `" if you have not done before.` }</span>
      </Box>
      <Flex alignItems="center" mt={ 8 } columnGap={ 5 }>
        { buttons }
      </Flex>
    </Box>
  );
};

export default React.memo(AddressVerificationStepSignature);
