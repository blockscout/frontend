import { Alert, Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type {
  AddressCheckResponseError,
  AddressCheckResponseSuccess,
  AddressCheckStatusSuccess,
  AddressVerificationFormFirstStepFields,
  RootFields,
} from '../types';

import appConfig from 'configs/app/config';
import useApiFetch from 'lib/api/useApiFetch';

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
    const body = {
      contractAddress: data.address,
    };
    const response = await apiFetch<'address_verification', AddressCheckResponseSuccess, AddressCheckResponseError>('address_verification', {
      fetchParams: { method: 'POST', body },
      pathParams: { chainId: appConfig.network.id, type: ':prepare' },
    });

    if (response.status !== 'SUCCESS') {
      switch (response.status) {
        case 'INVALID_ADDRESS_ERROR': {
          return setError('root', { type: 'manual', message: 'Specified address either does not exist or is EOA' });
        }
        case 'IS_OWNER_ERROR': {
          return setError('root', { type: 'manual', message: 'User is already an owner of the address' });
        }
        case 'OWNERSHIP_VERIFIED_ERROR': {
          return setError('root', { type: 'manual', message: 'Address ownership has been verified by another account' });
        }
        case 'SOURCE_CODE_NOT_VERIFIED_ERROR': {
          return setError('root', { type: 'manual', message: 'Contract source code has not been verified' });
        }

        default: {
          return setError('root', { type: 'manual', message: response.payload?.message || 'Oops! Something went wrong' });
        }
      }
    }

    onContinue({ ...response.result, address: data.address });
  }, [ apiFetch, onContinue, setError ]);

  const onSubmit = handleSubmit(onFormSubmit);

  return (
    <form noValidate onSubmit={ onSubmit }>
      { formState.errors.root?.type === 'manual' && <Alert status="warning" mb={ 6 }>{ formState.errors.root?.message }</Alert> }
      <Box mb={ 8 }>Let’s check your address...</Box>
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
