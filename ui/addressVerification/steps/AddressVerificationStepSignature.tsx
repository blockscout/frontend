import { Alert, Box, Button, chakra, Flex, Link, Radio, RadioGroup } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useSignMessage } from 'wagmi';

import type {
  AddressVerificationFormSecondStepFields,
  AddressCheckStatusSuccess,
  AddressVerificationFormFirstStepFields,
  RootFields,
  AddressVerificationResponseError,
  AddressValidationResponseSuccess,
} from '../types';
import type { VerifiedAddress } from 'types/api/account';

import appConfig from 'configs/app/config';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';

import AddressVerificationFieldMessage from '../fields/AddressVerificationFieldMessage';
import AddressVerificationFieldSignature from '../fields/AddressVerificationFieldSignature';

type Fields = RootFields & AddressVerificationFormSecondStepFields;

interface Props extends AddressVerificationFormFirstStepFields, AddressCheckStatusSuccess{
  onContinue: (newItem: VerifiedAddress) => void;
}

const AddressVerificationStepSignature = ({ address, signingMessage, contractCreator, contractOwner, onContinue }: Props) => {
  const [ signMethod, setSignMethod ] = React.useState<'wallet' | 'manually'>('wallet');

  const formApi = useForm<Fields>({
    mode: 'onBlur',
    defaultValues: {
      message: signingMessage,
    },
  });
  const { handleSubmit, formState, control, setValue, getValues, setError, clearErrors, watch } = formApi;

  const apiFetch = useApiFetch();

  const signature = watch('signature');
  React.useEffect(() => {
    clearErrors('root');
  }, [ clearErrors, signature ]);

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const body = {
        contractAddress: address,
        message: data.message,
        signature: data.signature,
      };

      const response = await apiFetch<'address_verification', AddressValidationResponseSuccess, AddressVerificationResponseError>('address_verification', {
        fetchParams: { method: 'POST', body },
        pathParams: { chainId: appConfig.network.id, type: ':verify' },
      });

      if (response.status !== 'SUCCESS') {
        switch (response.status) {
          case 'INVALID_SIGNATURE_ERROR': {
            return setError('root', { type: 'manual', message: 'Invalid signature' });
          }
          case 'VALIDITY_EXPIRED_ERROR': {
            return setError('root', { type: 'manual', message: 'Message validity expired' });
          }
          case 'INVALID_SIGNER_ERROR': {
            const message = `Invalid signer ${ response.invalidSigner.signer }. Expected: ${ response.invalidSigner.validAddresses.join(', ') }.`;
            return setError('root', { type: 'manual', message });
          }
          case 'UNKNOWN_STATUS': {
            return setError('root', { type: 'manual', message: 'Oops! Something went wrong' });
          }

          default: {
            return setError('root', { type: 'manual', message: response.payload?.message || 'Oops! Something went wrong' });
          }
        }
      }

      onContinue(response.result.verifiedAddress);
    } catch (_error: unknown) {
      const error = _error as ResourceError<AddressVerificationResponseError>;
      setError('root', { type: 'manual', message: error.payload?.message || 'Oops! Something went wrong' });
    }
  }, [ address, apiFetch, onContinue, setError ]);

  const onSubmit = handleSubmit(onFormSubmit);

  const { signMessage, isLoading: isSigning } = useSignMessage({
    onSuccess: (data) => {
      setValue('signature', data);
      onSubmit();
    },
    onError: (error) => {
      return setError('root', { type: 'manual', message: (error as Error)?.message || 'Oops! Something went wrong' });
    },
  });

  const handleSignMethodChange = React.useCallback((value: typeof signMethod) => {
    setSignMethod(value);
    clearErrors('root');
  }, [ clearErrors ]);

  const handleWeb3SignClick = React.useCallback(() => {
    const message = getValues('message');
    signMessage({ message });
  }, [ getValues, signMessage ]);

  const handleManualSignClick = React.useCallback(() => {
    onSubmit();
  }, [ onSubmit ]);

  return (
    <form noValidate onSubmit={ onSubmit }>
      { formState.errors.root?.type === 'manual' && <Alert status="warning" mb={ 6 }>{ formState.errors.root.message }</Alert> }
      <Box mb={ 8 }>
        <span>Please select the address below you will use to sign, copy the message, and sign it using your preferred method. </span>
        <Link>Additional instructions</Link>
      </Box>
      { (contractOwner || contractCreator) && (
        <Flex flexDir="column" rowGap={ 4 } mb={ 8 }>
          { contractCreator && (
            <Box>
              <chakra.span fontWeight={ 600 }>Contract creator: </chakra.span>
              <chakra.span>{ contractCreator }</chakra.span>
            </Box>
          ) }
          { contractOwner && (
            <Box>
              <chakra.span fontWeight={ 600 }>Contract owner: </chakra.span>
              <chakra.span>{ contractOwner }</chakra.span>
            </Box>
          ) }
        </Flex>
      ) }
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
