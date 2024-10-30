import {
  Box,
  Button,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { ApiKey, ApiKeys, ApiKeyErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

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
  const formApi = useForm<Inputs>({
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
        formApi.setError('name', { type: 'custom', message: getErrorMessage(errorMap, 'name') });
      } else if (errorMap?.identity_id) {
        formApi.setError('name', { type: 'custom', message: getErrorMessage(errorMap, 'identity_id') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback(async(data) => {
    setAlertVisible(false);
    await mutation.mutateAsync(data);
  }, [ mutation, setAlertVisible ]);

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ formApi.handleSubmit(onSubmit) }>
        { data && (
          <FormFieldText<Inputs>
            name="token"
            placeholder="Auto-generated API key token"
            isReadOnly
            bgColor="dialog_bg"
            mb={ 5 }
          />
        ) }
        <FormFieldText<Inputs>
          name="name"
          placeholder="Application name for API key (e.g Web3 project)"
          isRequired
          rules={{
            maxLength: NAME_MAX_LENGTH,
          }}
          bgColor="dialog_bg"
          mb={ 8 }
        />
        <Box marginTop={ 8 }>
          <Button
            size="lg"
            type="submit"
            isDisabled={ !formApi.formState.isDirty }
            isLoading={ mutation.isPending }
          >
            { data ? 'Save' : 'Generate API key' }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default ApiKeyForm;
