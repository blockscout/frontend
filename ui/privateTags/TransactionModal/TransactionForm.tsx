import React, { useCallback, useEffect } from 'react';
import type { SubmitHandler, ControllerRenderProps } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Button,
} from '@chakra-ui/react';

import TransactionInput from 'ui/shared/TransactionInput';
import TagInput from 'ui/shared/TagInput';

import type { TPrivateTagsTransactionItem } from 'data/privateTagsTransaction';

const HASH_LENGTH = 66;
const TAG_MAX_LENGTH = 35;

type Props = {
  data?: TPrivateTagsTransactionItem;
}

type Inputs = {
  transaction: string;
  tag: string;
}

const TransactionForm: React.FC<Props> = ({ data }) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  useEffect(() => {
    setValue('transaction', data?.transaction || '');
    setValue('tag', data?.tag || '');
  }, [ setValue, data ]);

  // eslint-disable-next-line no-console
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

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
        >
          { data ? 'Save changes' : 'Add tag' }
        </Button>
      </Box>
    </>
  )
}

export default TransactionForm;
