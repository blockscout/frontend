import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { ApiKey, ApiKeys, ApiKeyErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

type Props = {
  data?: ApiKey;
  onClose: () => void;
  setAlertVisible: (isAlertVisible: boolean) => void;
}

type Inputs = {
  token: string;
  name: string;
}

const NAME_MAX_LENGTH = 255;

const ApiKeyForm: React.FC<Props> = ({ data, onClose, setAlertVisible }) => {
  const { control, handleSubmit, formState: { errors, isDirty }, setError } = useForm<Inputs>({
    mode: 'onTouched',
    defaultValues: {
      token: data?.api_key || '',
      name: data?.name || '',
    },
  });
  const apiFetch = useApiFetch();
  const queryClient = useQueryClient();

  const updateApiKey = (data: Inputs) => {
    const body = { name: data.name };

    if (!data.token) {
      return apiFetch('api_keys', { fetchParams: { method: 'POST', body } });
    }

    return apiFetch('api_keys', {
      pathParams: { id: data.token },
      fetchParams: { method: 'PUT', body },
    });
  };

  const mutation = useMutation({
    mutationFn: updateApiKey,
    onSuccess: async(data) => {
      const response = data as unknown as ApiKey;

      queryClient.setQueryData([ resourceKey('api_keys') ], (prevData: ApiKeys | undefined) => {
        const isExisting = prevData && prevData.some((item) => item.api_key === response.api_key);

        if (isExisting) {
          return prevData.map((item) => {
            if (item.api_key === response.api_key) {
              return response;
            }

            return item;
          });
        }

        return [ response, ...(prevData || []) ];
      });

      onClose();
    },
    onError: (error: ResourceErrorAccount<ApiKeyErrors>) => {
      const errorMap = error.payload?.errors;
      if (errorMap?.name) {
        setError('name', { type: 'custom', message: getErrorMessage(errorMap, 'name') });
      } else if (errorMap?.identity_id) {
        setError('name', { type: 'custom', message: getErrorMessage(errorMap, 'identity_id') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
    setAlertVisible(false);
    mutation.mutate(data);
  }, [ mutation, setAlertVisible ]);

  const renderTokenInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'token'>}) => {
    return (
      <FormControl variant="floating" id="address">
        <Input
          { ...field }
          bgColor="dialog_bg"
          isReadOnly
        />
        <FormLabel>Auto-generated API key token</FormLabel>
      </FormControl>
    );
  }, []);

  const renderNameInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'name'>}) => {
    return (
      <FormControl variant="floating" id="name" isRequired bgColor="dialog_bg">
        <Input
          { ...field }
          isInvalid={ Boolean(errors.name) }
          maxLength={ NAME_MAX_LENGTH }
          bgColor="dialog_bg"
        />
        <InputPlaceholder text="Application name for API key (e.g Web3 project)" error={ errors.name }/>
      </FormControl>
    );
  }, [ errors ]);

  return (
    <form noValidate onSubmit={ handleSubmit(onSubmit) }>
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
            required: true,
          }}
          render={ renderNameInput }
        />
      </Box>
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          type="submit"
          isDisabled={ !isDirty }
          isLoading={ mutation.isPending }
        >
          { data ? 'Save' : 'Generate API key' }
        </Button>
      </Box>
    </form>
  );
};

export default ApiKeyForm;
