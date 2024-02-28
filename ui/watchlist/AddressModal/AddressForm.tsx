import {
  Box,
  Button,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { WatchlistAddress, WatchlistErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import AddressInput from 'ui/shared/AddressInput';
import CheckboxInput from 'ui/shared/CheckboxInput';
import TagInput from 'ui/shared/TagInput';

import AddressFormNotifications from './AddressFormNotifications';

// does it depend on the network?
const NOTIFICATIONS = [ 'native', 'ERC-20', 'ERC-721' ] as const;

const TAG_MAX_LENGTH = 35;

type Props = {
  data?: Partial<WatchlistAddress>;
  onSuccess: () => Promise<void>;
  setAlertVisible: (isAlertVisible: boolean) => void;
  isAdd: boolean;
}

type Inputs = {
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
  };
}

type Checkboxes = 'notification' |
'notification_settings.native.outcoming' |
'notification_settings.native.incoming' |
'notification_settings.ERC-20.outcoming' |
'notification_settings.ERC-20.incoming' |
'notification_settings.ERC-721.outcoming' |
'notification_settings.ERC-721.incoming';

const AddressForm: React.FC<Props> = ({ data, onSuccess, setAlertVisible, isAdd }) => {
  const [ pending, setPending ] = useState(false);
  const formBackgroundColor = useColorModeValue('white', 'gray.900');

  let notificationsDefault = {} as Inputs['notification_settings'];
  if (!data?.notification_settings) {
    NOTIFICATIONS.forEach(n => notificationsDefault[n] = { incoming: true, outcoming: true });
  } else {
    notificationsDefault = data.notification_settings;
  }

  const { control, handleSubmit, formState: { errors, isDirty }, setError } = useForm<Inputs>({
    defaultValues: {
      address: data?.address_hash || '',
      tag: data?.name || '',
      notification: data?.notification_methods ? data.notification_methods.email : true,
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
        pathParams: { id: data?.id || '' },
        fetchParams: { method: 'PUT', body },
      });

    } else {
      // add address
      return apiFetch('watchlist', { fetchParams: { method: 'POST', body } });
    }
  }

  const { mutate } = useMutation({
    mutationFn: updateWatchlist,
    onSuccess: async() => {
      await onSuccess();
      setPending(false);
    },
    onError: (error: ResourceErrorAccount<WatchlistErrors>) => {
      setPending(false);
      const errorMap = error.payload?.errors;
      if (errorMap?.address_hash || errorMap?.name) {
        errorMap?.address_hash && setError('address', { type: 'custom', message: getErrorMessage(errorMap, 'address_hash') });
        errorMap?.name && setError('tag', { type: 'custom', message: getErrorMessage(errorMap, 'name') });
      } else if (errorMap?.watchlist_id) {
        setError('address', { type: 'custom', message: getErrorMessage(errorMap, 'watchlist_id') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    setAlertVisible(false);
    setPending(true);
    mutate(formData);
  };

  const renderAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'address'>}) => {
    return (
      <AddressInput<Inputs, 'address'>
        field={ field }
        backgroundColor={ formBackgroundColor }
        error={ errors.address }
      />
    );
  }, [ errors, formBackgroundColor ]);

  const renderTagInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'tag'>}) => {
    return <TagInput<Inputs, 'tag'> field={ field } error={ errors.tag } backgroundColor={ formBackgroundColor }/>;
  }, [ errors, formBackgroundColor ]);

  // eslint-disable-next-line react/display-name
  const renderCheckbox = useCallback((text: string) => ({ field }: {field: ControllerRenderProps<Inputs, Checkboxes>}) => (
    <CheckboxInput<Inputs, Checkboxes> text={ text } field={ field }/>
  ), []);

  return (
    <form noValidate onSubmit={ handleSubmit(onSubmit) }>
      <Box marginBottom={ 5 }>
        <Controller
          name="address"
          control={ control }
          rules={{
            pattern: ADDRESS_REGEXP,
            required: true,
          }}
          render={ renderAddressInput }
        />
      </Box>
      <Box marginBottom={ 8 }>
        <Controller
          name="tag"
          control={ control }
          rules={{
            maxLength: TAG_MAX_LENGTH,
            required: true,
          }}
          render={ renderTagInput }
        />
      </Box>
      <Text variant="secondary" fontSize="sm" marginBottom={ 5 }>
        Please select what types of notifications you will receive
      </Text>
      <Box marginBottom={ 8 }>
        <AddressFormNotifications control={ control }/>
      </Box>
      <Text variant="secondary" fontSize="sm" marginBottom={{ base: '10px', lg: 5 }}>Notification methods</Text>
      <Controller
        name={ 'notification' as Checkboxes }
        control={ control }
        render={ renderCheckbox('Email notifications') }
      />
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          type="submit"
          isLoading={ pending }
          isDisabled={ !isDirty }
        >
          { !isAdd ? 'Save changes' : 'Add address' }
        </Button>
      </Box>
    </form>
  );
};

export default AddressForm;
