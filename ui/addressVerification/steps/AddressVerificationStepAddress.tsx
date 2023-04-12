import { Alert, Box, Button, Flex, Link } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type {
  AddressVerificationResponseError,
  AddressCheckResponseSuccess,
  AddressCheckStatusSuccess,
  AddressVerificationFormFirstStepFields,
  RootFields,
} from '../types';

import appConfig from 'configs/app/config';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import LinkInternal from 'ui/shared/LinkInternal';

import AddressVerificationFieldAddress from '../fields/AddressVerificationFieldAddress';
type Fields = RootFields & AddressVerificationFormFirstStepFields;

interface Props {
  onContinue: (data: AddressVerificationFormFirstStepFields & AddressCheckStatusSuccess) => void;
}

const AddressVerificationStepAddress = ({ onContinue }: Props) => {
  const formApi = useForm<Fields>({
    mode: 'onBlur',
  });
  const { handleSubmit, formState, control, setError, clearErrors, watch } = formApi;
  const apiFetch = useApiFetch();

  const address = watch('address');

  React.useEffect(() => {
    clearErrors('root');
  }, [ address, clearErrors ]);

  const onFormSubmit: SubmitHandler<Fields> = React.useCallback(async(data) => {
    try {
      const body = {
        contractAddress: data.address,
      };
      const response = await apiFetch<'address_verification', AddressCheckResponseSuccess, AddressVerificationResponseError>('address_verification', {
        fetchParams: { method: 'POST', body },
        pathParams: { chainId: appConfig.network.id, type: ':prepare' },
      });

      if (response.status !== 'SUCCESS') {
        const type = typeof response.status === 'number' ? 'UNKNOWN_ERROR' : response.status;
        const message = ('payload' in response ? response.payload?.message : undefined) || 'Oops! Something went wrong';
        return setError('root', { type, message });
      }

      onContinue({ ...response.result, address: data.address });
    } catch (_error) {
      const error = _error as ResourceError<AddressVerificationResponseError>;
      setError('root', { type: 'manual', message: error.payload?.message || 'Oops! Something went wrong' });
    }

  }, [ apiFetch, onContinue, setError ]);

  const onSubmit = handleSubmit(onFormSubmit);

  const rootError = (() => {
    switch (formState.errors.root?.type) {
      case 'INVALID_ADDRESS_ERROR': {
        return <span>Specified address either does not exist or is EOA.</span>;
      }
      case 'IS_OWNER_ERROR': {
        return <span>Ownership of this contract address ownership is already verified by this account.</span>;
      }
      case 'OWNERSHIP_VERIFIED_ERROR': {
        return <span>Ownership of this contract address is already verified by another account.</span>;
      }
      case 'SOURCE_CODE_NOT_VERIFIED_ERROR': {
        const href = route({ pathname: '/address/[hash]/contract_verification', query: { hash: address } });
        return (
          <Box>
            <span>The contract source code you entered is not yet verified. Please follow these steps to </span>
            <LinkInternal href={ href }>verify the contract</LinkInternal>
            <span>.</span>
          </Box>
        );
      }
      case undefined: {
        return null;
      }
      default: {
        return formState.errors.root?.message;
      }
    }
  })();

  return (
    <form noValidate onSubmit={ onSubmit }>
      <Box>Let’s check your address...</Box>
      { rootError && <Alert status="warning" mt={ 3 }>{ rootError }</Alert> }
      <AddressVerificationFieldAddress formState={ formState } control={ control }/>
      <Flex alignItems="center" mt={ 8 } columnGap={ 5 }>
        <Button size="lg" type="submit" isDisabled={ formState.isSubmitting }>
            Continue
        </Button>
        <Box>
          <span>Contact </span>
          <Link>support@blockscout.com</Link>
        </Box>
      </Flex>
    </form>
  );
};

export default React.memo(AddressVerificationStepAddress);
