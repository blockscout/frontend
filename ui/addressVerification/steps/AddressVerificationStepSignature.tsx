import { Alert, Box, Button, chakra, Flex, Link, Radio, RadioGroup } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
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

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import shortenString from 'lib/shortenString';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AdminSupportText from 'ui/shared/texts/AdminSupportText';

import AddressVerificationFieldMessage from '../fields/AddressVerificationFieldMessage';
import AddressVerificationFieldSignature from '../fields/AddressVerificationFieldSignature';

type Fields = RootFields & AddressVerificationFormSecondStepFields;

type SignMethod = 'wallet' | 'manual';

interface Props extends AddressVerificationFormFirstStepFields, AddressCheckStatusSuccess{
  onContinue: (newItem: VerifiedAddress, signMethod: SignMethod) => void;
  noWeb3Provider?: boolean;
}

const AddressVerificationStepSignature = ({ address, signingMessage, contractCreator, contractOwner, onContinue, noWeb3Provider }: Props) => {
  const [ signMethod, setSignMethod ] = React.useState<SignMethod>(noWeb3Provider ? 'manual' : 'wallet');

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
        pathParams: { chainId: config.chain.id, type: ':verify' },
      });

      if (response.status !== 'SUCCESS') {
        const type = typeof response.status === 'number' ? 'UNKNOWN_STATUS' : response.status;
        return setError('root', { type, message: response.status === 'INVALID_SIGNER_ERROR' ? response.invalidSigner.signer : undefined });
      }

      onContinue(response.result.verifiedAddress, signMethod);
    } catch (error) {
      setError('root', { type: 'UNKNOWN_STATUS' });
    }
  }, [ address, apiFetch, onContinue, setError, signMethod ]);

  const onSubmit = handleSubmit(onFormSubmit);

  const { signMessage, isLoading: isSigning } = useSignMessage({
    onSuccess: (data) => {
      setValue('signature', data);
      onSubmit();
    },
    onError: (error) => {
      return setError('root', { type: 'SIGNING_FAIL', message: (error as Error)?.message || 'Oops! Something went wrong' });
    },
  });

  const handleSignMethodChange = React.useCallback((value: typeof signMethod) => {
    setSignMethod(value);
    clearErrors('root');
  }, [ clearErrors ]);

  const handleOpenWeb3Modal = React.useCallback(() => {
    clearErrors('root');
    openWeb3Modal();
  }, [ clearErrors, openWeb3Modal ]);

  const handleWeb3SignClick = React.useCallback(() => {
    clearErrors('root');

    if (!isConnected) {
      return setError('root', { type: 'manual', message: 'Please connect to your Web3 wallet first' });
    }

    const message = getValues('message');
    signMessage({ message });
  }, [ clearErrors, isConnected, getValues, signMessage, setError ]);

  const handleManualSignClick = React.useCallback(() => {
    clearErrors('root');
    onSubmit();
  }, [ clearErrors, onSubmit ]);

  const button = (() => {
    if (signMethod === 'manual') {
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

  const contactUsLink = <span>contact us <Link href="mailto:help@blockscout.com">help@blockscout.com</Link></span>;

  const rootError = (() => {
    switch (formState.errors.root?.type) {
      case 'INVALID_SIGNATURE_ERROR': {
        return <span>The signature could not be processed.</span>;
      }
      case 'VALIDITY_EXPIRED_ERROR': {
        return <span>This verification message has expired. Add the contract address to restart the process.</span>;
      }
      case 'SIGNING_FAIL': {
        return <span>{ formState.errors.root.message }</span>;
      }
      case 'INVALID_SIGNER_ERROR': {
        const signer = shortenString(formState.errors.root.message || '');
        const expectedSigners = [ contractCreator, contractOwner ].filter(Boolean).map(s => shortenString(s)).join(', ');
        return (
          <Box>
            <span>This address </span>
            <span>{ signer }</span>
            <span> is not a creator/owner of the requested contract and cannot claim ownership. Only </span>
            <span>{ expectedSigners }</span>
            <span> can verify ownership of this contract.</span>
          </Box>
        );
      }
      case 'UNKNOWN_STATUS': {
        return (
          <Box>
            <span>We are not able to process the verify account ownership for this contract address. Kindly </span>
            { contactUsLink }
            <span> for further assistance.</span>
          </Box>
        );
      }
      case undefined: {
        return null;
      }
    }
  })();

  return (
    <form noValidate onSubmit={ onSubmit }>
      { rootError && <Alert status="warning" mb={ 6 }>{ rootError }</Alert> }
      <Box mb={ 8 }>
        <span>Please select the address to sign and copy the message and sign it using the Blockscout message provider of your choice. </span>
        <Link href="https://docs.blockscout.com/for-users/my-account/verified-addresses/copy-and-sign-message" target="_blank">
          Additional instructions
        </Link>
        <span>. If you do not see your address here but are sure that you are the owner of the contract, kindly </span>
        { contactUsLink }
        <span> for further assistance.</span>
      </Box>
      { (contractOwner || contractCreator) && (
        <Flex flexDir="column" rowGap={ 4 } mb={ 4 }>
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
        { !noWeb3Provider && (
          <RadioGroup onChange={ handleSignMethodChange } value={ signMethod } display="flex" flexDir="column" rowGap={ 4 }>
            <Radio value="wallet">Sign via Web3 wallet</Radio>
            <Radio value="manually">Sign manually</Radio>
          </RadioGroup>
        ) }
        { signMethod === 'manual' && <AddressVerificationFieldSignature formState={ formState } control={ control }/> }
      </Flex>
      <Flex alignItems={{ base: 'flex-start', lg: 'center' }} mt={ 8 } columnGap={ 5 } rowGap={ 2 } flexDir={{ base: 'column', lg: 'row' }}>
        { button }
        <AdminSupportText/>
      </Flex>
    </form>
  );
};

export default React.memo(AddressVerificationStepSignature);
