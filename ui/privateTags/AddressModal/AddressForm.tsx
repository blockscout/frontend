import React, { useCallback, useEffect } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Button,
} from '@chakra-ui/react';

import AddressInput from 'ui/shared/AddressInput';
import TagInput from 'ui/shared/TagInput';

import type { TPrivateTagsAddressItem } from 'data/privateTagsAddress';

const ADDRESS_LENGTH = 42;
const TAG_MAX_LENGTH = 35;

type Props = {
  data?: TPrivateTagsAddressItem;
}

type Inputs = {
  address: string;
  tag: string;
}

const AddressForm: React.FC<Props> = ({ data }) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  useEffect(() => {
    setValue('address', data?.address || '');
    setValue('tag', data?.tag || '');
  }, [ setValue, data ]);

  // eslint-disable-next-line no-console
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

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
        >
          { data ? 'Save changes' : 'Add tag' }
        </Button>
      </Box>
    </>
  )
}

export default AddressForm;
