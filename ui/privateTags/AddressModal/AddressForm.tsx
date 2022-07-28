import React, { useCallback, useEffect, useState } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Button,
} from '@chakra-ui/react';

import AddressInput from 'ui/shared/AddressInput';
import TagInput from 'ui/shared/TagInput';
import type { AddressTag } from 'types/api/account';

const ADDRESS_LENGTH = 42;
const TAG_MAX_LENGTH = 35;

type Props = {
  data?: AddressTag;
  onClose: () => void;
}

type Inputs = {
  address: string;
  tag: string;
}

const AddressForm: React.FC<Props> = ({ data, onClose }) => {
  const [ pending, setPending ] = useState(false);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  useEffect(() => {
    setValue('address', data?.address_hash || '');
    setValue('tag', data?.name || '');
  }, [ setValue, data ]);

  const queryClient = useQueryClient();

  const { mutate } = useMutation((formData: Inputs) => {
    let mutationFunction;
    const requestParams = {
      name: formData?.tag,
      address_hash: formData?.address,
    }
    if (data) {
      // edit tag
      const params = new URLSearchParams(requestParams);
      mutationFunction = () => fetch(`/api/account/private-tags/address/${ data.id }?${ params.toString() }`, { method: 'PUT' })
    } else {
      // add tag
      mutationFunction = () => fetch('/api/account/private-tags/address', { method: 'POST', body: JSON.stringify(requestParams) })
    }
    return mutationFunction();
  }, {
    onError: () => {
      // eslint-disable-next-line no-console
      console.log('error');
    },
    onSuccess: () => {
      queryClient.refetchQueries([ 'address' ]).then(() => {
        onClose();
        setPending(false);
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    setPending(true);
    mutate(formData);
  };

  const renderAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'address'>}) => {
    return <AddressInput<Inputs, 'address'> field={ field } isInvalid={ Boolean(errors.address) }/>
  }, [ errors ]);

  const renderTagInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'tag'>}) => {
    return <TagInput field={ field } isInvalid={ Boolean(errors.tag) }/>
  }, [ errors ]);

  return (
    <>
      <Box marginBottom={ 5 }>
        <Controller
          name="address"
          control={ control }
          rules={{
            maxLength: ADDRESS_LENGTH,
            minLength: ADDRESS_LENGTH,
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
  )
}

export default AddressForm;
