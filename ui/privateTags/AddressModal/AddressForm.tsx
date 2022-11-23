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
import { QueryKeys } from 'types/client/accountQueries';

import getErrorMessage from 'lib/getErrorMessage';
import type { ErrorType } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';
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
  const fetch = useFetch();
  const [ pending, setPending ] = useState(false);
  const { control, handleSubmit, formState: { errors, isValid }, setError } = useForm<Inputs>({
    mode: 'all',
    defaultValues: {
      address: data?.address_hash || '',
      tag: data?.name || '',
    },
  });

  const formBackgroundColor = useColorModeValue('white', 'gray.900');

  const queryClient = useQueryClient();

  const { mutate } = useMutation((formData: Inputs) => {
    const body = {
      name: formData?.tag,
      address_hash: formData?.address,
    };

    const isEdit = data?.id;
    if (isEdit) {
      return fetch(`/node-api/account/private-tags/address/${ data.id }`, { method: 'PUT', body });
    }

    return fetch('/node-api/account/private-tags/address', { method: 'POST', body });
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
      queryClient.refetchQueries([ QueryKeys.addressTags ]).then(() => {
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
    return <AddressInput<Inputs, 'address'> field={ field } error={ errors.address } backgroundColor={ formBackgroundColor }/>;
  }, [ errors, formBackgroundColor ]);

  const renderTagInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'tag'>}) => {
    return <TagInput<Inputs, 'tag'> field={ field } error={ errors.tag } backgroundColor={ formBackgroundColor }/>;
  }, [ errors, formBackgroundColor ]);

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
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          type="submit"
          disabled={ !isValid }
          isLoading={ pending }
        >
          { data ? 'Save changes' : 'Add tag' }
        </Button>
      </Box>
    </form>
  );
};

export default AddressForm;
