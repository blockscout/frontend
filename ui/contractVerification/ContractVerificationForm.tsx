import { Button, chakra } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { FormFields } from './types';

import ContractVerificationFieldMethod from './ContractVerificationFieldMethod';

const ContractVerificationForm = () => {
  const { control, handleSubmit } = useForm<FormFields>({
    defaultValues: {
      method: 'flatten_source_code',
    },
  });

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback((data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);
  }, []);

  return (
    <chakra.form
      noValidate
      onSubmit={ handleSubmit(onFormSubmit) }
      mt={ 12 }
    >
      <ContractVerificationFieldMethod control={ control }/>
      <Button
        variant="solid"
        size="lg"
        type="submit"
        mt={ 12 }
      >
        Verify & publish
      </Button>
    </chakra.form>
  );
};

export default React.memo(ContractVerificationForm);
