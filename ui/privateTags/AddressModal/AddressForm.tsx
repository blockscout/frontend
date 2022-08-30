import {
  Box,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { AddressTag, AddressTagErrors } from 'types/api/account';

import type { ErrorType } from 'lib/client/fetch';
import fetch from 'lib/client/fetch';
import getErrorMessage from 'lib/getErrorMessage';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import AddressInput from 'ui/shared/AddressInput';
import TagInput from 'ui/shared/TagInput';

const TAG_MAX_LENGTH = 35;

type Props = {
  data?: AddressTag;
  onClose: () => void;
  setAlertVisible: (isAlertVisible: boolean) => void;
}

type Inputs = {
  address: string;
  tag: string;
}

const AddressForm: React.FC<Props> = ({ data, onClose, setAlertVisible }) => {
  const [ pending, setPending ] = useState(false);
  const { control, handleSubmit, formState: { errors }, setError } = useForm<Inputs>({
    mode: 'all',
    defaultValues: {
      address: data?.address_hash || '',
      tag: data?.name || '',
    },
  });

  const formBackgroundColor = useColorModeValue('white', 'gray.900');

  const queryClient = useQueryClient();

  const { mutate } = useMutation((formData: Inputs) => {
    const body = JSON.stringify({
      name: formData?.tag,
      address_hash: formData?.address,
    });

    const isEdit = data?.id;
    if (isEdit) {
      return fetch(`/api/account/private-tags/address/${ data.id }`, { method: 'PUT', body });
    }

    return fetch('/api/account/private-tags/address', { method: 'POST', body });
  }, {
    onError: (e: ErrorType<AddressTagErrors>) => {
      setPending(false);
      if (e?.error?.address_hash || e?.error?.name) {
        e?.error?.address_hash && setError('address', { type: 'custom', message: getErrorMessage(e.error, 'address_hash') });
        e?.error?.name && setError('tag', { type: 'custom', message: getErrorMessage(e.error, 'name') });
      } else if (e?.error?.identity_id) {
        setError('address', { type: 'custom', message: getErrorMessage(e.error, 'identity_id') });
      } else {
        setAlertVisible(true);
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries([ 'address-tags' ]).then(() => {
        onClose();
        setPending(false);
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    setAlertVisible(false);
    setPending(true);
    mutate(formData);
  };

  const renderAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'address'>}) => {
    return <AddressInput<Inputs, 'address'> field={ field } error={ errors.address?.message } backgroundColor={ formBackgroundColor }/>;
  }, [ errors, formBackgroundColor ]);

  const renderTagInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'tag'>}) => {
    return <TagInput<Inputs, 'tag'> field={ field } error={ errors.tag?.message } backgroundColor={ formBackgroundColor }/>;
  }, [ errors, formBackgroundColor ]);

  return (
    <>
      <Box marginBottom={ 5 }>
        <Controller
          name="address"
          control={ control }
          rules={{
            pattern: ADDRESS_REGEXP,
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
          }}
          render={ renderTagInput }
        />
      </Box>
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          variant="primary"
          onClick={ handleSubmit(onSubmit) }
          disabled={ Object.keys(errors).length > 0 }
          isLoading={ pending }
        >
          { data ? 'Save changes' : 'Add tag' }
        </Button>
      </Box>
    </>
  );
};

export default AddressForm;
