import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import type { ControllerRenderProps, SubmitHandler } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { CustomAbi, CustomAbis } from 'types/api/account';

type Props = {
  data?: CustomAbi;
  onClose: () => void;
}

type Inputs = {
  contract_address_hash: string;
  name: string;
  abi: string;
}

// idk, maybe there is no limit
const NAME_MAX_LENGTH = 100;

const CustomAbiForm: React.FC<Props> = ({ data, onClose }) => {
  const { control, formState: { errors }, setValue, handleSubmit } = useForm<Inputs>();
  const queryClient = useQueryClient();

  useEffect(() => {
    setValue('contract_address_hash', data?.contract_address_hash || '');
    setValue('name', data?.name || '');
    setValue('abi', JSON.stringify(data?.abi) || '');
  }, [ setValue, data ]);

  const customAbiKey = (data: Inputs & { id?: number }) => {
    const body = JSON.stringify({ name: data.name, contract_address_hash: data.contract_address_hash, abi: data.abi });

    if (!data.id) {
      return fetch('/api/account/custom-abis', { method: 'POST', body });
    }

    return fetch(`/api/account/custom-abis/${ data.id }`, { method: 'PUT', body });
  };

  const mutation = useMutation(customAbiKey, {
    onSuccess: async(data) => {
      const response: CustomAbi = await data.json();

      queryClient.setQueryData([ 'custom-abis' ], (prevData: CustomAbis | undefined) => {
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
    // eslint-disable-next-line no-console
    onError: console.error,
  });

  const onSubmit: SubmitHandler<Inputs> = useCallback((formData) => {
    mutation.mutate({ ...formData, id: data?.id });
  }, [ mutation, data ]);

  const renderContractAddressInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'contract_address_hash'>}) => {
    return (
      <FormControl variant="floating" id="contract_address_hash" isRequired>
        <Input
          { ...field }
          isInvalid={ Boolean(errors.contract_address_hash) }
        />
        <FormLabel>Smart contract address (0x...)</FormLabel>
      </FormControl>
    );
  }, [ errors ]);

  const renderNameInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'name'>}) => {
    return (
      <FormControl variant="floating" id="name" isRequired>
        <Input
          { ...field }
          isInvalid={ Boolean(errors.name) }
          maxLength={ NAME_MAX_LENGTH }
        />
        <FormLabel>Project name</FormLabel>
      </FormControl>
    );
  }, [ errors ]);

  const renderAbiInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'abi'>}) => {
    return (
      <FormControl variant="floating" id="abi" isRequired>
        <Textarea
          { ...field }
          size="lg"
          isInvalid={ Boolean(errors.abi) }
        />
        <FormLabel>{ `Custom ABI [{...}] (JSON format)` }</FormLabel>
      </FormControl>
    );
  }, [ errors ]);

  return (
    <>
      <Box>
        <Controller
          name="contract_address_hash"
          control={ control }
          render={ renderContractAddressInput }
        />
      </Box>
      <Box marginTop={ 5 }>
        <Controller
          name="name"
          control={ control }
          rules={{
            maxLength: NAME_MAX_LENGTH,
          }}
          render={ renderNameInput }
        />
      </Box>
      <Box marginTop={ 5 }>
        <Controller
          name="abi"
          control={ control }
          render={ renderAbiInput }
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
          { data ? 'Save' : 'Create custom ABI' }
        </Button>
      </Box>
    </>
  );
};

export default React.memo(CustomAbiForm);
