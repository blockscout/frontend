import {
  Box,
  Button,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { CustomAbi, CustomAbis, CustomAbiErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import FormFieldAddress from 'ui/shared/forms/fields/FormFieldAddress';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

type Props = {
  data?: CustomAbi;
  onClose: () => void;
  setAlertVisible: (isAlertVisible: boolean) => void;
}

type Inputs = {
  contract_address_hash: string;
  name: string;
  abi: string;
}

const NAME_MAX_LENGTH = 255;

const CustomAbiForm: React.FC<Props> = ({ data, onClose, setAlertVisible }) => {
  const formApi = useForm<Inputs>({
    defaultValues: {
      contract_address_hash: data?.contract_address_hash || '',
      name: data?.name || '',
      abi: JSON.stringify(data?.abi) || '',
    },
    mode: 'onTouched',
  });

  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();

  const customAbiKey = (data: Inputs & { id?: string }) => {
    const body = { name: data.name, contract_address_hash: data.contract_address_hash, abi: data.abi };

    if (!data.id) {
      return apiFetch('custom_abi', { fetchParams: { method: 'POST', body } });
    }

    return apiFetch('custom_abi', {
      pathParams: { id: String(data.id) },
      fetchParams: { method: 'PUT', body },
    });
  };

  const mutation = useMutation({
    mutationFn: customAbiKey,
    onSuccess: (data) => {
      const response = data as unknown as CustomAbi;
      queryClient.setQueryData([ resourceKey('custom_abi') ], (prevData: CustomAbis | undefined) => {
        const isExisting = prevData && prevData.some((item) => item.id === response.id);

        if (isExisting) {
          return prevData.map((item) => {
            if (item.id === response.id) {
              return response;
            }

            return item;
          });
        }

        return [ response, ...(prevData || []) ];
      });

      onClose();
    },
    onError: (error: ResourceErrorAccount<CustomAbiErrors>) => {
      const errorMap = error.payload?.errors;
      if (errorMap?.address_hash || errorMap?.name || errorMap?.abi) {
        errorMap?.address_hash && formApi.setError('contract_address_hash', { type: 'custom', message: getErrorMessage(errorMap, 'address_hash') });
        errorMap?.name && formApi.setError('name', { type: 'custom', message: getErrorMessage(errorMap, 'name') });
        errorMap?.abi && formApi.setError('abi', { type: 'custom', message: getErrorMessage(errorMap, 'abi') });
      } else if (errorMap?.identity_id) {
        formApi.setError('contract_address_hash', { type: 'custom', message: getErrorMessage(errorMap, 'identity_id') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback(async(formData) => {
    setAlertVisible(false);
    await mutation.mutateAsync({ ...formData, id: data?.id ? String(data.id) : undefined });
  }, [ mutation, data, setAlertVisible ]);

  return (
    <FormProvider { ...formApi }>
      <form noValidate onSubmit={ formApi.handleSubmit(onSubmit) }>
        <FormFieldAddress<Inputs>
          name="contract_address_hash"
          placeholder="Smart contract address (0x...)"
          isRequired
          bgColor="dialog_bg"
          mb={ 5 }
        />
        <FormFieldText<Inputs>
          name="name"
          placeholder="Project name"
          isRequired
          rules={{
            maxLength: NAME_MAX_LENGTH,
          }}
          bgColor="dialog_bg"
          mb={ 5 }
        />
        <FormFieldText<Inputs>
          name="abi"
          placeholder="Custom ABI [{...}] (JSON format)"
          isRequired
          asComponent="Textarea"
          bgColor="dialog_bg"
          size="lg"
          minH="300px"
          mb={ 8 }
        />
        <Box>
          <Button
            size="lg"
            type="submit"
            isDisabled={ !formApi.formState.isDirty }
            isLoading={ mutation.isPending }
          >
            { data ? 'Save' : 'Create custom ABI' }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default React.memo(CustomAbiForm);
