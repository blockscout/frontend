import {
  Alert,
  Box,
  Button,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { WatchlistAddress, WatchlistErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import FormFieldAddress from 'ui/shared/forms/fields/FormFieldAddress';
import FormFieldCheckbox from 'ui/shared/forms/fields/FormFieldCheckbox';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';
import AuthModal from 'ui/snippets/auth/AuthModal';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

import AddressFormNotifications from './AddressFormNotifications';

// does it depend on the network?
const NOTIFICATIONS = [ 'native', 'ERC-20', 'ERC-721', 'ERC-404' ] as const;

const TAG_MAX_LENGTH = 35;

type Props = {
  data?: Partial<WatchlistAddress>;
  onSuccess: () => Promise<void>;
  setAlertVisible: (isAlertVisible: boolean) => void;
  isAdd: boolean;
};

export type Inputs = {
  address: string;
  tag: string;
  notification: boolean;
  notification_settings: {
    'native': {
      outcoming: boolean;
      incoming: boolean;
    };
    'ERC-721': {
      outcoming: boolean;
      incoming: boolean;
    };
    'ERC-20': {
      outcoming: boolean;
      incoming: boolean;
    };
    'ERC-404': {
      outcoming: boolean;
      incoming: boolean;
    };
  };
};

const AddressForm: React.FC<Props> = ({ data, onSuccess, setAlertVisible, isAdd }) => {
  const [ pending, setPending ] = useState(false);

  const profileQuery = useProfileQuery();
  const userWithoutEmail = profileQuery.data && !profileQuery.data.email;
  const authModal = useDisclosure();

  let notificationsDefault = {} as Inputs['notification_settings'];
  if (!data?.notification_settings) {
    NOTIFICATIONS.forEach(n => notificationsDefault[n] = { incoming: !userWithoutEmail, outcoming: !userWithoutEmail });
  } else {
    notificationsDefault = data.notification_settings;
  }

  const formApi = useForm<Inputs>({
    defaultValues: {
      address: data?.address_hash || '',
      tag: data?.name || '',
      notification: data?.notification_methods ? data.notification_methods.email : !userWithoutEmail,
      notification_settings: notificationsDefault,
    },
    mode: 'onTouched',
  });

  const apiFetch = useApiFetch();

  function updateWatchlist(formData: Inputs) {
    const body = {
      name: formData?.tag,
      address_hash: formData?.address,
      notification_settings: formData.notification_settings,
      notification_methods: {
        email: formData.notification,
      },
    };
    if (!isAdd && data) {
      // edit address
      return apiFetch('watchlist', {
        pathParams: { id: data?.id ? String(data.id) : '' },
        fetchParams: { method: 'PUT', body },
      });

    } else {
      // add address
      return apiFetch('watchlist', { fetchParams: { method: 'POST', body } });
    }
  }

  const { mutateAsync } = useMutation({
    mutationFn: updateWatchlist,
    onSuccess: async() => {
      await onSuccess();
      setPending(false);
    },
    onError: (error: ResourceErrorAccount<WatchlistErrors>) => {
      setPending(false);
      const errorMap = error.payload?.errors;
      if (errorMap?.address_hash || errorMap?.name) {
        errorMap?.address_hash && formApi.setError('address', { type: 'custom', message: getErrorMessage(errorMap, 'address_hash') });
        errorMap?.name && formApi.setError('tag', { type: 'custom', message: getErrorMessage(errorMap, 'name') });
      } else if (errorMap?.watchlist_id) {
        formApi.setError('address', { type: 'custom', message: getErrorMessage(errorMap, 'watchlist_id') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async(formData) => {
    setAlertVisible(false);
    setPending(true);
    await mutateAsync(formData);
  };

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ formApi.handleSubmit(onSubmit) }>
        <FormFieldAddress<Inputs>
          name="address"
          isRequired
          bgColor="dialog_bg"
          mb={ 5 }
        />
        <FormFieldText<Inputs>
          name="tag"
          placeholder="Private tag (max 35 characters)"
          isRequired
          rules={{
            maxLength: TAG_MAX_LENGTH,
          }}
          bgColor="dialog_bg"
          mb={ 8 }
        />
        { userWithoutEmail ? (
          <>
            <Alert
              status="info"
              colorScheme="gray"
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'flex-start', lg: 'center' }}
              columnGap={ 2 }
              rowGap={ 2 }
              w="fit-content"
            >
              To receive notifications you need to add an email to your profile.
              <Button variant="outline" size="sm" onClick={ authModal.onOpen }>Add email</Button>
            </Alert>
            { authModal.isOpen && <AuthModal initialScreen={{ type: 'email', isAuth: true }} onClose={ authModal.onClose }/> }
          </>
        ) : (
          <>
            <Text variant="secondary" fontSize="sm" marginBottom={ 5 }>
              Please select what types of notifications you will receive
            </Text>
            <Box marginBottom={ 8 }>
              <AddressFormNotifications/>
            </Box>
            <Text variant="secondary" fontSize="sm" marginBottom={{ base: '10px', lg: 5 }}>Notification methods</Text>
            <FormFieldCheckbox<Inputs, 'notification'>
              name="notification"
              label="Email notifications"
            />
          </>
        ) }
        <Box marginTop={ 8 }>
          <Button
            size="lg"
            type="submit"
            isLoading={ pending }
            isDisabled={ !formApi.formState.isDirty }
          >
            { !isAdd ? 'Save changes' : 'Add address' }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddressForm;
