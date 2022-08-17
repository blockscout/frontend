import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { CustomAbi } from 'types/api/account';

type Props = {
  data?: CustomAbi;
  onClose: () => void;
}

type Inputs = {
  contract_address_hash: string;
  name: string;
}

// idk, maybe there is no limit
const NAME_MAX_LENGTH = 100;

const CustomAbiForm: React.FC<Props> = ({ data }) => {
  const { control, formState: { errors }, setValue } = useForm<Inputs>();
  // const queryClient = useQueryClient();

  useEffect(() => {
    setValue('contract_address_hash', data?.contract_address_hash || '');
    setValue('name', data?.name || '');
  }, [ setValue, data ]);

  // const updateApiKey = (data: Inputs) => {
  //   const body = JSON.stringify({ name: data.name });

  //   if (!data.token) {
  //     return fetch('/api/account/api-keys', { method: 'POST', body });
  //   }

  //   return fetch(`/api/account/api-keys/${ data.token }`, { method: 'PUT', body });
  // };

  // const mutation = useMutation(updateApiKey, {
  //   onSuccess: async(data) => {
  //     const response: CustomAbi = await data.json();

  //     queryClient.setQueryData([ 'api-keys' ], (prevData: CustomAbis | undefined) => {
  //       const isExisting = prevData && prevData.some((item) => item.api_key === response.api_key);

  //       if (isExisting) {
  //         return prevData.map((item) => {
  //           if (item.api_key === response.api_key) {
  //             return response;
  //           }

  //           return item;
  //         });
  //       }

  //       return [ ...(prevData || []), response ];
  //     });

  //     onClose();
  //   },
  //   // eslint-disable-next-line no-console
  //   onError: console.error,
  // });

  // const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
  //   mutation.mutate(data);
  // }, [ mutation ]);

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

  return (
    <>
      <Box marginBottom={ 5 }>
        <Controller
          name="contract_address_hash"
          control={ control }
          render={ renderContractAddressInput }
        />
      </Box>
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
          // onClick={ handleSubmit(onSubmit) }
          disabled={ Object.keys(errors).length > 0 }
          // isLoading={ mutation.isLoading }
        >
          { data ? 'Save' : 'Create custom ABI' }
        </Button>
      </Box>
    </>
  );
};

export default React.memo(CustomAbiForm);
