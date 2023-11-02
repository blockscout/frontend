import {
  Box,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { TransactionTag, TransactionTagErrors } from 'types/api/account';

import type { ResourceErrorAccount } from 'lib/api/resources';
import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/getErrorMessage';
import { TRANSACTION_HASH_REGEXP } from 'lib/validations/transaction';
import TagInput from 'ui/shared/TagInput';
import TransactionInput from 'ui/shared/TransactionInput';

const TAG_MAX_LENGTH = 35;

type Props = {
  data?: Partial<TransactionTag>;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  setAlertVisible: (isAlertVisible: boolean) => void;
}

type Inputs = {
  transaction: string;
  tag: string;
}

const TransactionForm: React.FC<Props> = ({ data, onClose, onSuccess, setAlertVisible }) => {
  const [ pending, setPending ] = useState(false);
  const formBackgroundColor = useColorModeValue('white', 'gray.900');

  const { control, handleSubmit, formState: { errors, isDirty }, setError } = useForm<Inputs>({
    mode: 'onTouched',
    defaultValues: {
      transaction: data?.transaction_hash || '',
      tag: data?.name || '',
    },
  });

  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();

  const { mutate } = useMutation({
    mutationFn: (formData: Inputs) => {
      const body = {
        name: formData?.tag,
        transaction_hash: formData?.transaction,
      };
      const isEdit = data?.id;

      if (isEdit) {
        return apiFetch('private_tags_tx', {
          pathParams: { id: data.id },
          fetchParams: { method: 'PUT', body },
        });
      }

      return apiFetch('private_tags_tx', { fetchParams: { method: 'POST', body } });
    },
    onError: (error: ResourceErrorAccount<TransactionTagErrors>) => {
      setPending(false);
      const errorMap = error.payload?.errors;
      if (errorMap?.tx_hash || errorMap?.name) {
        errorMap?.tx_hash && setError('transaction', { type: 'custom', message: getErrorMessage(errorMap, 'tx_hash') });
        errorMap?.name && setError('tag', { type: 'custom', message: getErrorMessage(errorMap, 'name') });
      } else if (errorMap?.identity_id) {
        setError('transaction', { type: 'custom', message: getErrorMessage(errorMap, 'identity_id') });
      } else {
        setAlertVisible(true);
      }
    },
    onSuccess: async() => {
      await queryClient.refetchQueries({ queryKey: [ resourceKey('private_tags_tx') ] });
      await onSuccess();
      onClose();
      setPending(false);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = formData => {
    setPending(true);
    mutate(formData);
  };

  const renderTransactionInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'transaction'>}) => {
    return <TransactionInput field={ field } error={ errors.transaction } backgroundColor={ formBackgroundColor }/>;
  }, [ errors, formBackgroundColor ]);

  const renderTagInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'tag'>}) => {
    return <TagInput<Inputs, 'tag'> field={ field } error={ errors.tag } backgroundColor={ formBackgroundColor }/>;
  }, [ errors, formBackgroundColor ]);

  return (
    <form noValidate onSubmit={ handleSubmit(onSubmit) }>
      <Box marginBottom={ 5 }>
        <Controller
          name="transaction"
          control={ control }
          rules={{
            pattern: TRANSACTION_HASH_REGEXP,
            required: true,
          }}
          render={ renderTransactionInput }
        />
      </Box>
      <Box marginBottom={ 8 }>
        <Controller
          name="tag"
          control={ control }
          rules={{
            maxLength: TAG_MAX_LENGTH,
            required: true,
          }}
          render={ renderTagInput }
        />
      </Box>
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          type="submit"
          isDisabled={ !isDirty }
          isLoading={ pending }
        >
          { data ? 'Save changes' : 'Add tag' }
        </Button>
      </Box>
    </form>
  );
};

export default TransactionForm;
