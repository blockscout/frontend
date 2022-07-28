import React, { useCallback, useEffect, useState } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import type { TransactionTag } from 'types/api/account';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Button,
} from '@chakra-ui/react';

import TransactionInput from 'ui/shared/TransactionInput';
import TagInput from 'ui/shared/TagInput';

const HASH_LENGTH = 66;
const TAG_MAX_LENGTH = 35;

type Props = {
  data?: TransactionTag;
  onClose: () => void;
}

type Inputs = {
  transaction: string;
  tag: string;
}

const TransactionForm: React.FC<Props> = ({ data, onClose }) => {
  const [ pending, setPending ] = useState(false);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  useEffect(() => {
    setValue('transaction', data?.transaction_hash || '');
    setValue('tag', data?.name || '');
  }, [ setValue, data ]);

  const queryClient = useQueryClient();

  const { mutate } = useMutation((formData: Inputs) => {
    return fetch('/api/account/private-tags/transaction', { method: 'POST', body: JSON.stringify({
      name: formData?.tag,
      transaction_hash: formData?.transaction,
    }) })
  }, {
    onError: () => {
      // eslint-disable-next-line no-console
      console.log('error');
    },
    onSuccess: () => {
      queryClient.refetchQueries([ 'transaction' ]).then(() => {
        onClose();
        setPending(false);
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = formData => {
    setPending(true);
    // api method for editing is not implemented now!!!
    mutate(formData)
  }

  const renderTransactionInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'transaction'>}) => {
    return <TransactionInput field={ field } isInvalid={ Boolean(errors.transaction) }/>
  }, [ errors ]);

  const renderTagInput = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'tag'>}) => {
    return <TagInput field={ field } isInvalid={ Boolean(errors.tag) }/>
  }, [ errors ]);

  return (
    <>
      <Box marginBottom={ 5 }>
        <Controller
          name="transaction"
          control={ control }
          rules={{
            maxLength: HASH_LENGTH,
            minLength: HASH_LENGTH,
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
          }}
          render={ renderTagInput }
        />
      </Box>
      <Box marginTop={ 8 }>
        <Button
          size="lg"
          variant="primary"
          onClick={ handleSubmit(onSubmit) }
          disabled={ Object.keys(errors).length > 0 }
          isLoading={ pending }
        >
          { data ? 'Save changes' : 'Add tag' }
        </Button>
      </Box>
    </>
  )
}

export default TransactionForm;
