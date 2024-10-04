import {
  Box,
  Button,
  FormControl,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, SubmitHandler } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { CustomAbi, CustomAbis, CustomAbiErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import AddressInput from 'ui/shared/AddressInput';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

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
  const { control, formState: { errors, isDirty }, handleSubmit, setError } = useForm<Inputs>({
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
        errorMap?.address_hash && setError('contract_address_hash', { type: 'custom', message: getErrorMessage(errorMap, 'address_hash') });
        errorMap?.name && setError('name', { type: 'custom', message: getErrorMessage(errorMap, 'name') });
        errorMap?.abi && setError('abi', { type: 'custom', message: getErrorMessage(errorMap, 'abi') });
      } else if (errorMap?.identity_id) {
        setError('contract_address_hash', { type: 'custom', message: getErrorMessage(errorMap, 'identity_id') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback((formData) => {
    setAlertVisible(false);
    mutation.mutate({ ...formData, id: data?.id ? String(data.id) : undefined });
  }, [ mutation, data, setAlertVisible ]);

  const renderContractAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'contract_address_hash'>}) => {
    return (
      <AddressInput<Inputs, 'contract_address_hash'>
        field={ field }
        error={ errors.contract_address_hash }
        bgColor="dialog_bg"
        placeholder="Smart contract address (0x...)"
      />
    );
  }, [ errors ]);

  const renderNameInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'name'>}) => {
    return (
      <FormControl variant="floating" id="name" isRequired bgColor="dialog_bg">
        <Input
          { ...field }
          isInvalid={ Boolean(errors.name) }
          maxLength={ NAME_MAX_LENGTH }
          bgColor="dialog_bg"
        />
        <InputPlaceholder text="Project name" error={ errors.name }/>
      </FormControl>
    );
  }, [ errors ]);

  const renderAbiInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'abi'>}) => {
    return (
      <FormControl variant="floating" id="abi" isRequired bgColor="dialog_bg">
        <Textarea
          { ...field }
          size="lg"
          minH="300px"
          isInvalid={ Boolean(errors.abi) }
          bgColor="dialog_bg"
        />
        <InputPlaceholder text="Custom ABI [{...}] (JSON format)" error={ errors.abi }/>
      </FormControl>
    );
  }, [ errors ]);

  return (
    <form noValidate onSubmit={ handleSubmit(onSubmit) }>
      <Box>
        <Controller
          name="contract_address_hash"
          control={ control }
          render={ renderContractAddressInput }
          rules={{
            pattern: ADDRESS_REGEXP,
            required: true,
          }}
        />
      </Box>
      <Box marginTop={ 5 }>
        <Controller
          name="name"
          control={ control }
          render={ renderNameInput }
          rules={{ required: true }}
        />
      </Box>
      <Box marginTop={ 5 }>
        <Controller
          name="abi"
          control={ control }
          render={ renderAbiInput }
          rules={{ required: true }}
        />
      </Box>
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          type="submit"
          isDisabled={ !isDirty }
          isLoading={ mutation.isPending }
        >
          { data ? 'Save' : 'Create custom ABI' }
        </Button>
      </Box>
    </form>
  );
};

export default React.memo(CustomAbiForm);
