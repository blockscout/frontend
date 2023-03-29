import { Alert, Box, Button, Flex, Radio, RadioGroup } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useSignMessage } from 'wagmi';

import type { AddressVerificationFormFields } from '../types';

import AddressVerificationFieldMessage from '../fields/AddressVerificationFieldMessage';
import AddressVerificationFieldSignature from '../fields/AddressVerificationFieldSignature';

interface Props {
  onSubmit: () => void;
  onSign: () => void;
}

const AddressVerificationStepSignature = ({ onSubmit, onSign }: Props) => {
  const [ signMethod, setSignMethod ] = React.useState<'wallet' | 'manually'>('wallet');
  const [ error, setError ] = React.useState('');

  const { getValues, setValue, formState } = useFormContext<AddressVerificationFormFields>();
  const { signMessage, isLoading: isSigning } = useSignMessage({
    onSuccess: (data) => {
      setValue('signature', data);
      onSubmit();
    },
    onError: (error) => {
      setError((error as Error)?.message || 'Something went wrong');
    },
  });

  const handleSignMethodChange = React.useCallback((value: typeof signMethod) => {
    setSignMethod(value);
    setError('');
  }, []);

  const handleWeb3SignClick = React.useCallback(() => {
    onSign();
    const message = getValues('message');
    signMessage({ message });
  }, [ getValues, onSign, signMessage ]);

  const handleManualSignClick = React.useCallback(() => {
    onSign();
    onSubmit();
  }, [ onSign, onSubmit ]);

  return (
    <Box>
      { error && <Alert status="warning" mb={ 6 }>{ error }</Alert> }
      <Box mb={ 8 }>
        Please select the address to sign and copy the message below and sign it using the Blockscout sign message provider of your choice...
      </Box>
      <Flex rowGap={ 5 } flexDir="column">
        <AddressVerificationFieldMessage isDisabled/>
        <RadioGroup onChange={ handleSignMethodChange } value={ signMethod } display="flex" flexDir="column" rowGap={ 4 }>
          <Radio value="wallet">Sign via Web3 wallet</Radio>
          <Radio value="manually">Sign manually</Radio>
        </RadioGroup>
        { signMethod === 'manually' && <AddressVerificationFieldSignature/> }
      </Flex>
      <Flex alignItems="center" mt={ 8 } columnGap={ 5 }>
        <Button
          size="lg"
          onClick={ signMethod === 'manually' ? handleManualSignClick : handleWeb3SignClick }
          isLoading={ formState.isSubmitting || isSigning }
          loadingText={ isSigning ? 'Signing' : 'Verifying' }
        >
          { signMethod === 'manually' ? 'Verify' : 'Sign and verify' }
        </Button>
      </Flex>
    </Box>
  );
};

export default React.memo(AddressVerificationStepSignature);
