import { Button, chakra } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { FormFields } from './types';
import type { SocketMessage } from 'lib/socket/types';
import type { SmartContractVerificationMethod, SmartContractVerificationConfig } from 'types/api/contract';

import useApiFetch from 'lib/api/useApiFetch';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';

import ContractVerificationFieldMethod from './fields/ContractVerificationFieldMethod';
import ContractVerificationFlattenSourceCode from './methods/ContractVerificationFlattenSourceCode';
import ContractVerificationMultiPartFile from './methods/ContractVerificationMultiPartFile';
import ContractVerificationSourcify from './methods/ContractVerificationSourcify';
import ContractVerificationStandardInput from './methods/ContractVerificationStandardInput';
import ContractVerificationVyperContract from './methods/ContractVerificationVyperContract';
import ContractVerificationVyperMultiPartFile from './methods/ContractVerificationVyperMultiPartFile';
import { prepareRequestBody, METHOD_TO_ENDPOINT_MAP } from './utils';

const METHOD_COMPONENTS = {
  flattened_code: <ContractVerificationFlattenSourceCode/>,
  standard_input: <ContractVerificationStandardInput/>,
  sourcify: <ContractVerificationSourcify/>,
  multi_part: <ContractVerificationMultiPartFile/>,
  vyper_code: <ContractVerificationVyperContract/>,
  vyper_multi_part: <ContractVerificationVyperMultiPartFile/>,
};

interface Props {
  method?: SmartContractVerificationMethod;
  config: SmartContractVerificationConfig;
  hash: string;
}

const ContractVerificationForm = ({ method: methodFromQuery, config, hash }: Props) => {
  const formApi = useForm<FormFields>({
    mode: 'onBlur',
    defaultValues: {
      method: methodFromQuery,
    },
  });
  const { control, handleSubmit, watch, formState } = formApi;
  const submitPromiseResolver = React.useRef<(value: unknown) => void>();

  const apiFetch = useApiFetch();

  const onFormSubmit: SubmitHandler<FormFields> = React.useCallback(async(data) => {
    // eslint-disable-next-line no-console
    console.log('__>__', data);

    const body = prepareRequestBody(data);

    try {
      await apiFetch('contract_verification_via', {
        pathParams: { method: METHOD_TO_ENDPOINT_MAP[data.method], id: hash },
        fetchParams: {
          method: 'POST',
          body,
        },
      });
    } catch (error) {
      return;
    }

    return new Promise((resolve) => {
      submitPromiseResolver.current = resolve;
    });
  }, [ apiFetch, hash ]);

  const handleNewSocketMessage: SocketMessage.ContractVerification['handler'] = React.useCallback((payload) => {
    // eslint-disable-next-line no-console
    console.log('__>__', payload);
  }, []);

  const handleSocketError = React.useCallback(() => {
    submitPromiseResolver.current?.(null);
  }, []);

  const channel = useSocketChannel({
    topic: `address:${ hash }`,
    onSocketClose: handleSocketError,
    onSocketError: handleSocketError,
    isDisabled: !formState.isSubmitting,
  });
  useSocketMessage({
    channel,
    event: 'verification',
    handler: handleNewSocketMessage,
  });

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
