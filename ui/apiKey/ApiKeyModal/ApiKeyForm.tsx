import React, { useCallback, useEffect } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

import type { TApiKeyItem } from 'data/apiKey';

type Props = {
  data?: TApiKeyItem;
}

type Inputs = {
  token: string;
  name: string;
}

// idk, maybe there is no limit
const NAME_MAX_LENGTH = 100;

const ApiKeyForm: React.FC<Props> = ({ data }) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  useEffect(() => {
    setValue('token', data?.token || '');
    setValue('name', data?.name || '');
  }, [ setValue, data ]);

  // eslint-disable-next-line no-console
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  const renderTokenInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'token'>}) => {
    return (
      <FormControl variant="floating" id="address" isRequired>
        <Input
          { ...field }
          placeholder=" "
          disabled={ true }
        />
        <FormLabel>Auto-generated API key token</FormLabel>
      </FormControl>
    )
  }, []);

  const renderNameInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'name'>}) => {
    return (
      <FormControl variant="floating" id="name" isRequired>
        <Input
          { ...field }
          placeholder=" "
          isInvalid={ Boolean(errors.name) }
          maxLength={ NAME_MAX_LENGTH }
        />
        <FormLabel>Application name for API key (e.g Web3 project)</FormLabel>
      </FormControl>
    )
  }, [ errors ]);

  return (
    <>
      { data && (
        <Box marginBottom={ 5 }>
          <Controller
            name="token"
            control={ control }
            render={ renderTokenInput }
          />
        </Box>
      ) }
      <Box marginBottom={ 8 }>
        <Controller
          name="name"
          control={ control }
          rules={{
            maxLength: NAME_MAX_LENGTH,
          }}
          render={ renderNameInput }
        />
      </Box>
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          variant="primary"
          onClick={ handleSubmit(onSubmit) }
          disabled={ Object.keys(errors).length > 0 }
        >
          { data ? 'Save' : 'Generate API key' }
        </Button>
      </Box>
    </>
  )
}

export default ApiKeyForm;
