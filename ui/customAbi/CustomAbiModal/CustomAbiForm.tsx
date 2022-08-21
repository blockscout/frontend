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

import type { CustomAbi, CustomAbis } from 'types/api/account';

import { ADDRESS_REGEXP } from 'lib/validations/address';
import AddressInput from 'ui/shared/AddressInput';

type Props = {
  data?: CustomAbi;
  onClose: () => void;
}

type Inputs = {
  contract_address_hash: string;
  name: string;
  abi: string;
}

const NAME_MAX_LENGTH = 255;

const CustomAbiForm: React.FC<Props> = ({ data, onClose }) => {
  const { control, formState: { errors }, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      contract_address_hash: data?.contract_address_hash || '',
      name: data?.name || '',
      abi: JSON.stringify(data?.abi) || '',
    },
    mode: 'all',
  });

  const queryClient = useQueryClient();

  const customAbiKey = (data: Inputs & { id?: number }) => {
    const body = JSON.stringify({ name: data.name, contract_address_hash: data.contract_address_hash, abi: data.abi });

    if (!data.id) {
      return fetch('/api/account/custom-abis', { method: 'POST', body });
    }

    return fetch(`/api/account/custom-abis/${ data.id }`, { method: 'PUT', body });
  };

  const formBackgroundColor = useColorModeValue('white', 'gray.900');

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
      <AddressInput<Inputs, 'contract_address_hash'>
        field={ field }
        isInvalid={ Boolean(errors.contract_address_hash) }
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
        <FormLabel>Project name</FormLabel>
      </FormControl>
    );
  }, [ errors, formBackgroundColor ]);

  const renderAbiInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'abi'>}) => {
    return (
      <FormControl variant="floating" id="abi" isRequired backgroundColor={ formBackgroundColor }>
        <Textarea
          { ...field }
          size="lg"
          isInvalid={ Boolean(errors.abi) }
        />
        <FormLabel>{ `Custom ABI [{...}] (JSON format)` }</FormLabel>
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
          rules={{ pattern: ADDRESS_REGEXP }}
        />
      </Box>
      <Box marginTop={ 5 }>
        <Controller
          name="name"
          control={ control }
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
