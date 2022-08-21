import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { ApiKey, ApiKeys } from 'types/api/account';

type Props = {
  data?: ApiKey;
  onClose: () => void;
}

type Inputs = {
  token: string;
  name: string;
}

const NAME_MAX_LENGTH = 255;

const ApiKeyForm: React.FC<Props> = ({ data, onClose }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<Inputs>({
    mode: 'all',
    defaultValues: {
      token: data?.api_key || '',
      name: data?.name || '',
    },
  });
  const queryClient = useQueryClient();
  const formBackgroundColor = useColorModeValue('white', 'gray.900');

  const updateApiKey = (data: Inputs) => {
    const body = JSON.stringify({ name: data.name });

    if (!data.token) {
      return fetch('/api/account/api-keys', { method: 'POST', body });
    }

    return fetch(`/api/account/api-keys/${ data.token }`, { method: 'PUT', body });
  };

  const mutation = useMutation(updateApiKey, {
    onSuccess: async(data) => {
      const response: ApiKey = await data.json();

      queryClient.setQueryData([ 'api-keys' ], (prevData: ApiKeys | undefined) => {
        const isExisting = prevData && prevData.some((item) => item.api_key === response.api_key);

        if (isExisting) {
          return prevData.map((item) => {
            if (item.api_key === response.api_key) {
              return response;
            }

            return item;
          });
        }

        return [ ...(prevData || []), response ];
      });

      onClose();
    },
    // eslint-disable-next-line no-console
    onError: console.error,
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
    mutation.mutate(data);
  }, [ mutation ]);

  const renderTokenInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'token'>}) => {
    return (
      <FormControl variant="floating" id="address" isRequired>
        <Input
          { ...field }
          disabled={ true }
        />
        <FormLabel>Auto-generated API key token</FormLabel>
      </FormControl>
    );
  }, []);

  const renderNameInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'name'>}) => {
    return (
      <FormControl variant="floating" id="name" isRequired backgroundColor={ formBackgroundColor }>
        <Input
          { ...field }
          isInvalid={ Boolean(errors.name) }
          maxLength={ NAME_MAX_LENGTH }
        />
        <FormLabel>Application name for API key (e.g Web3 project)</FormLabel>
      </FormControl>
    );
  }, [ errors, formBackgroundColor ]);

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
          isLoading={ mutation.isLoading }
        >
          { data ? 'Save' : 'Generate API key' }
        </Button>
      </Box>
    </>
  );
};

export default ApiKeyForm;
