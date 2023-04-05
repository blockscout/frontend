import { Alert, Box, Button, chakra, Flex, Link, Radio, RadioGroup } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useSignMessage, useAccount } from 'wagmi';

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
import shortenString from 'lib/shortenString';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import AddressVerificationFieldMessage from '../fields/AddressVerificationFieldMessage';
import AddressVerificationFieldSignature from '../fields/AddressVerificationFieldSignature';

type Fields = RootFields & AddressVerificationFormSecondStepFields;

interface Props extends AddressVerificationFormFirstStepFields, AddressCheckStatusSuccess{
  onContinue: (newItem: VerifiedAddress) => void;
}

const AddressVerificationStepSignature = ({ address, signingMessage, contractCreator, contractOwner, onContinue }: Props) => {
  const [ signMethod, setSignMethod ] = React.useState<'wallet' | 'manually'>('wallet');

  const { open: openWeb3Modal } = useWeb3Modal();
  const { isConnected } = useAccount();

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
            const signer = shortenString(response.invalidSigner.signer);
            const expectedSigners = [ contractCreator, contractOwner ].filter(Boolean).map(shortenString).join(', ');
            const message = `Invalid signer ${ signer }. Expected: ${ expectedSigners }.`;
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
  }, [ address, apiFetch, contractCreator, contractOwner, onContinue, setError ]);

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

  const handleOpenWeb3Modal = React.useCallback(() => {
    openWeb3Modal();
  }, [ openWeb3Modal ]);

  const handleWeb3SignClick = React.useCallback(() => {
    if (!isConnected) {
      return setError('root', { type: 'manual', message: 'Please connect to your Web3 wallet first' });
    }
    const message = getValues('message');
    signMessage({ message });
  }, [ getValues, signMessage, isConnected, setError ]);

  const handleManualSignClick = React.useCallback(() => {
    onSubmit();
  }, [ onSubmit ]);

  const button = (() => {
    if (signMethod === 'manually') {
      return (
        <Button
          size="lg"
          onClick={ handleManualSignClick }
          isLoading={ formState.isSubmitting }
          loadingText="Verifying"
        >
          Verify
        </Button>
      );
    }

    return (
      <Button
        size="lg"
        onClick={ isConnected ? handleWeb3SignClick : handleOpenWeb3Modal }
        isLoading={ formState.isSubmitting || isSigning }
        loadingText={ isSigning ? 'Signing' : 'Verifying' }
      >
        { isConnected ? 'Sign and verify' : 'Connect wallet' }
      </Button>
    );
  })();

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
        <div>
          <CopyToClipboard text={ signingMessage } ml="auto" display="block"/>
          <AddressVerificationFieldMessage formState={ formState } control={ control }/>
        </div>
        <RadioGroup onChange={ handleSignMethodChange } value={ signMethod } display="flex" flexDir="column" rowGap={ 4 }>
          <Radio value="wallet">Sign via Web3 wallet</Radio>
          <Radio value="manually">Sign manually</Radio>
        </RadioGroup>
        { signMethod === 'manually' && <AddressVerificationFieldSignature formState={ formState } control={ control }/> }
      </Flex>
      <Flex alignItems="center" mt={ 8 } columnGap={ 5 }>
        { button }
      </Flex>
    </form>
  );
};

export default React.memo(AddressVerificationStepSignature);
