import { Alert, Box, Button, Flex, Radio, RadioGroup } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useSignMessage } from 'wagmi';

import type { AddressVerificationFormSecondStepFields, AddressCheckStatusSuccess, AddressVerificationFormFirstStepFields } from '../types';

import appConfig from 'configs/app/config';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';

import AddressVerificationFieldMessage from '../fields/AddressVerificationFieldMessage';
import AddressVerificationFieldSignature from '../fields/AddressVerificationFieldSignature';

interface Props extends AddressVerificationFormFirstStepFields, AddressCheckStatusSuccess{}

const AddressVerificationStepSignature = ({ address, signingMessage }: Props) => {
  const [ signMethod, setSignMethod ] = React.useState<'wallet' | 'manually'>('wallet');
  const [ error, setError ] = React.useState('');

  const formApi = useForm<AddressVerificationFormSecondStepFields>({
    mode: 'onBlur',
    defaultValues: {
      message: signingMessage,
    },
  });
  const { handleSubmit, formState, control, setValue, getValues } = formApi;

  const apiFetch = useApiFetch();

  const { signMessage, isLoading: isSigning } = useSignMessage({
    onSuccess: (data) => {
      setValue('signature', data);
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
    const message = getValues('message');
    signMessage({ message });
  }, [ getValues, signMessage ]);

  const handleManualSignClick = React.useCallback(() => {
  }, []);

  const onFormSubmit: SubmitHandler<AddressVerificationFormSecondStepFields> = React.useCallback(async(data) => {
    const body = {
      contractAddress: address,
      message: data.message,
      signature: data.signature,
    };

    try {
      await apiFetch('address_verification', {
        fetchParams: { method: 'POST', body },
        pathParams: { chainId: appConfig.network.id, type: ':verify' },
      });
    } catch (error: unknown) {
      const _error = error as ResourceError<{message: string}>;
      setError(_error.payload?.message || 'Oops! Something went wrong');
    }
  }, [ address, apiFetch ]);

  const onSubmit = handleSubmit(onFormSubmit);

  return (
    <form noValidate onSubmit={ onSubmit }>
      { error && <Alert status="warning" mb={ 6 }>{ error }</Alert> }
      <Box mb={ 8 }>
        Please select the address to sign and copy the message below and sign it using the Blockscout sign message provider of your choice...
      </Box>
      <Flex rowGap={ 5 } flexDir="column">
        <AddressVerificationFieldMessage formState={ formState } control={ control }/>
        <RadioGroup onChange={ handleSignMethodChange } value={ signMethod } display="flex" flexDir="column" rowGap={ 4 }>
          <Radio value="wallet">Sign via Web3 wallet</Radio>
          <Radio value="manually">Sign manually</Radio>
        </RadioGroup>
        { signMethod === 'manually' && <AddressVerificationFieldSignature formState={ formState } control={ control }/> }
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
    </form>
  );
};

export default React.memo(AddressVerificationStepSignature);
