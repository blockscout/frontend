import {
  Box,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { AddressTag, AddressTagErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import AddressInput from 'ui/shared/AddressInput';
import TagInput from 'ui/shared/TagInput';

const TAG_MAX_LENGTH = 35;

type Props = {
  data?: Partial<AddressTag>;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  setAlertVisible: (isAlertVisible: boolean) => void;
}

type Inputs = {
  address: string;
  tag: string;
}

const AddressForm: React.FC<Props> = ({ data, onClose, onSuccess, setAlertVisible }) => {
  const apiFetch = useApiFetch();
  const [ pending, setPending ] = useState(false);
  const { control, handleSubmit, formState: { errors, isDirty }, setError } = useForm<Inputs>({
    mode: 'onTouched',
    defaultValues: {
      address: data?.address_hash || '',
      tag: data?.name || '',
    },
  });

  const formBackgroundColor = useColorModeValue('white', 'gray.900');

  const { mutate } = useMutation({
    mutationFn: (formData: Inputs) => {
      const body = {
        name: formData?.tag,
        address_hash: formData?.address,
      };

      const isEdit = data?.id;
      if (isEdit) {
        return apiFetch('private_tags_address', {
          pathParams: { id: data.id },
          fetchParams: { method: 'PUT', body },
        });
      }

      return apiFetch('private_tags_address', { fetchParams: { method: 'POST', body } });
    },
    onError: (error: ResourceErrorAccount<AddressTagErrors>) => {
      setPending(false);
      const errorMap = error.payload?.errors;
      if (errorMap?.address_hash || errorMap?.name) {
        errorMap?.address_hash && setError('address', { type: 'custom', message: getErrorMessage(errorMap, 'address_hash') });
        errorMap?.name && setError('tag', { type: 'custom', message: getErrorMessage(errorMap, 'name') });
      } else if (errorMap?.identity_id) {
        setError('address', { type: 'custom', message: getErrorMessage(errorMap, 'identity_id') });
      } else {
        setAlertVisible(true);
      }
    },
    onSuccess: async() => {
      await onSuccess();
      onClose();
      setPending(false);
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
          isDisabled={ !isDirty }
          isLoading={ pending }
        >
          { data ? 'Save changes' : 'Add tag' }
        </Button>
      </Box>
    </form>
  );
};

export default AddressForm;
