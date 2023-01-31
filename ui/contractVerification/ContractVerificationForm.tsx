import { Button, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields, VerificationMethod } from './types';

import delay from 'lib/delay';

import ContractVerificationFieldMethod, { VERIFICATION_METHODS } from './fields/ContractVerificationFieldMethod';
import ContractVerificationFlattenSourceCode from './methods/ContractVerificationFlattenSourceCode';
import ContractVerificationMultiPartFile from './methods/ContractVerificationMultiPartFile';
import ContractVerificationSourcify from './methods/ContractVerificationSourcify';
import ContractVerificationStandardInput from './methods/ContractVerificationStandardInput';
import ContractVerificationVyperContract from './methods/ContractVerificationVyperContract';

const METHODS = {
  flatten_source_code: <ContractVerificationFlattenSourceCode/>,
  standard_input: <ContractVerificationStandardInput/>,
  sourcify: <ContractVerificationSourcify/>,
  multi_part_file: <ContractVerificationMultiPartFile/>,
  vyper_contract: <ContractVerificationVyperContract/>,
};

const ContractVerificationForm = () => {
  const router = useRouter();
  const methodFromQuery = router.query.method?.toString() as VerificationMethod;
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      method: VERIFICATION_METHODS.includes(methodFromQuery) ? methodFromQuery : undefined,
    },
  });
  const { control, handleSubmit, watch, formState } = formApi;

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);
    await delay(5_000);
  }, []);

  const method = watch('method');

  const content = METHODS[method] || null;

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ handleSubmit(onFormSubmit) }
        mt={ 12 }
      >
        <ContractVerificationFieldMethod control={ control } isDisabled={ Boolean(method) }/>
        { content }
        { Boolean(method) && (
          <Button
            variant="solid"
            size="lg"
            type="submit"
            mt={ 12 }
            isLoading={ formState.isSubmitting }
            loadingText="Verify & publish"
          >
            Verify & publish
          </Button>
        ) }
      </chakra.form>
    </FormProvider>
  );
};

export default React.memo(ContractVerificationForm);
