import { Button, chakra } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields } from './types';
import type { SmartContractVerificationMethod, SmartContractVerificationConfig } from 'types/api/contract';

import delay from 'lib/delay';

import ContractVerificationFieldMethod from './fields/ContractVerificationFieldMethod';
import ContractVerificationFlattenSourceCode from './methods/ContractVerificationFlattenSourceCode';
import ContractVerificationMultiPartFile from './methods/ContractVerificationMultiPartFile';
import ContractVerificationSourcify from './methods/ContractVerificationSourcify';
import ContractVerificationStandardInput from './methods/ContractVerificationStandardInput';
import ContractVerificationVyperContract from './methods/ContractVerificationVyperContract';

const METHOD_COMPONENTS = {
  flattened_code: <ContractVerificationFlattenSourceCode/>,
  standard_input: <ContractVerificationStandardInput/>,
  sourcify: <ContractVerificationSourcify/>,
  multi_part: <ContractVerificationMultiPartFile/>,
  vyper_multi_part: <ContractVerificationVyperContract/>,
};

interface Props {
  method?: SmartContractVerificationMethod;
  config: SmartContractVerificationConfig;
}

const ContractVerificationForm = ({ method: methodFromQuery, config }: Props) => {
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      method: methodFromQuery,
    },
  });
  const { control, handleSubmit, watch, formState } = formApi;

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);
    await delay(5_000);
  }, []);

  const method = watch('method');

  const content = METHOD_COMPONENTS[method] || null;

  return (
    <FormProvider { ...formApi }>
      <chakra.form
        noValidate
        onSubmit={ handleSubmit(onFormSubmit) }
      >
        <ContractVerificationFieldMethod
          control={ control }
          isDisabled={ Boolean(method) }
          methods={ config.verification_options }
        />
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
