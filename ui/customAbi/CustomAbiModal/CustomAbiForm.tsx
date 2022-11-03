import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, SubmitHandler } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { CustomAbi, CustomAbis, CustomAbiErrors } from 'types/api/account';
import { QueryKeys } from 'types/client/accountQueries';

import getErrorMessage from 'lib/getErrorMessage';
import getPlaceholderWithError from 'lib/getPlaceholderWithError';
import type { ErrorType } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import AddressInput from 'ui/shared/AddressInput';

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
  const { control, formState: { errors, isValid }, handleSubmit, setError } = useForm<Inputs>({
    defaultValues: {
      contract_address_hash: data?.contract_address_hash || '',
      name: data?.name || '',
      abi: JSON.stringify(data?.abi) || '',
    },
    mode: 'all',
  });

  const queryClient = useQueryClient();
  const fetch = useFetch();

  const customAbiKey = (data: Inputs & { id?: number }) => {
    const body = { name: data.name, contract_address_hash: data.contract_address_hash, abi: data.abi };

    if (!data.id) {
      return fetch<CustomAbi, CustomAbiErrors>('/node-api/account/custom-abis', { method: 'POST', body });
    }

    return fetch<CustomAbi, CustomAbiErrors>(`/node-api/account/custom-abis/${ data.id }`, { method: 'PUT', body });
  };

  const formBackgroundColor = useColorModeValue('white', 'gray.900');

  const mutation = useMutation(customAbiKey, {
    onSuccess: (data) => {
      const response = data as unknown as CustomAbi;
      queryClient.setQueryData([ QueryKeys.customAbis ], (prevData: CustomAbis | undefined) => {
        const isExisting = prevData && prevData.some((item) => item.id === response.id);

        if (isExisting) {
          return prevData.map((item) => {
            if (item.id === response.id) {
              return response;
            }

            return item;
          });
        }

        return [ ...(prevData || []), response ];
      });

      onClose();
    },
    onError: (e: ErrorType<CustomAbiErrors>) => {
      if (e?.error?.address_hash || e?.error?.name || e?.error?.abi) {
        e?.error?.address_hash && setError('contract_address_hash', { type: 'custom', message: getErrorMessage(e.error, 'address_hash') });
        e?.error?.name && setError('name', { type: 'custom', message: getErrorMessage(e.error, 'name') });
        e?.error?.abi && setError('abi', { type: 'custom', message: getErrorMessage(e.error, 'abi') });
      } else if (e?.error?.identity_id) {
        setError('contract_address_hash', { type: 'custom', message: getErrorMessage(e.error, 'identity_id') });
      } else {
        setAlertVisible(true);
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback((formData) => {
    setAlertVisible(false);
    mutation.mutate({ ...formData, id: data?.id });
  }, [ mutation, data, setAlertVisible ]);

  const renderContractAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'contract_address_hash'>}) => {
    return (
      <AddressInput<Inputs, 'contract_address_hash'>
        field={ field }
        error={ errors.contract_address_hash }
        backgroundColor={ formBackgroundColor }
        placeholder="Smart contract address (0x...)"
      />
    );
  }, [ errors, formBackgroundColor ]);

  const renderNameInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'name'>}) => {
    return (
      <FormControl variant="floating" id="name" isRequired backgroundColor={ formBackgroundColor }>
        <Input
          { ...field }
          isInvalid={ Boolean(errors.name) }
          maxLength={ NAME_MAX_LENGTH }
        />
        <FormLabel>{ getPlaceholderWithError('Project name', errors.name?.message) }</FormLabel>
      </FormControl>
    );
  }, [ errors, formBackgroundColor ]);

  const renderAbiInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'abi'>}) => {
    return (
      <FormControl variant="floating" id="abi" isRequired backgroundColor={ formBackgroundColor }>
        <Textarea
          { ...field }
          size="lg"
          minH="300px"
          isInvalid={ Boolean(errors.abi) }
        />
        <FormLabel>{ getPlaceholderWithError(`Custom ABI [{...}] (JSON format)`, errors.abi?.message) }</FormLabel>
      </FormControl>
    );
  }, [ errors, formBackgroundColor ]);

  return (
    <>
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
          onClick={ handleSubmit(onSubmit) }
          disabled={ !isValid }
          isLoading={ mutation.isLoading }
        >
          { data ? 'Save' : 'Create custom ABI' }
        </Button>
      </Box>
    </>
  );
};

export default React.memo(CustomAbiForm);
