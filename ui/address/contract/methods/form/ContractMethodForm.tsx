import { Box, Button, Flex, Tooltip, chakra } from '@chakra-ui/react';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import type { AbiFunction } from 'viem';

import type { FormSubmitHandler, FormSubmitResult, MethodCallStrategy, SmartContractMethod } from '../types';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import { isReadMethod } from '../utils';
import ContractMethodFieldAccordion from './ContractMethodFieldAccordion';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';
import ContractMethodResultPublicClient from './ContractMethodResultPublicClient';
import ContractMethodResultWalletClient from './ContractMethodResultWalletClient';
import { getFieldLabel, matchArray, transformFormDataToMethodArgs } from './utils';
import type { ContractMethodFormFields } from './utils';

// eslint-disable-next-line max-len
const NO_WALLET_CLIENT_TEXT = 'Blockchain interaction is not available at the moment since WalletConnect is not configured for this application. Please contact the service maintainer to make necessary changes in the service configuration.';

interface Props {
  data: SmartContractMethod;
  attempt: number;
  onSubmit: FormSubmitHandler;
  isOpen: boolean;
  onReset: () => void;
}

const ContractMethodForm = ({ data, attempt, onSubmit, onReset, isOpen }: Props) => {

  const [ result, setResult ] = React.useState<FormSubmitResult>();
  const [ isLoading, setLoading ] = React.useState(false);
  const [ callStrategy, setCallStrategy ] = React.useState<MethodCallStrategy>();
  const callStrategyRef = React.useRef(callStrategy);

  const formApi = useForm<ContractMethodFormFields>({
    mode: 'all',
    shouldUnregister: true,
  });

  const handleButtonClick = React.useCallback((event: React.MouseEvent) => {
    const callStrategy = event?.currentTarget.getAttribute('data-call-strategy');
    setCallStrategy(callStrategy as MethodCallStrategy);
    callStrategyRef.current = callStrategy as MethodCallStrategy;
  }, []);

  const methodType = isReadMethod(data) ? 'read' : 'write';

  const onFormSubmit: SubmitHandler<ContractMethodFormFields> = React.useCallback(async(formData) => {
    const args = transformFormDataToMethodArgs(formData);

    setResult(undefined);
    setLoading(true);

    onSubmit(data, args, callStrategyRef.current)
      .then((result) => {
        setResult(result);
      })
      .catch((error: Error) => {
        setResult({
          source: callStrategyRef.current === 'write' ? 'wallet_client' : 'public_client',
          data: error,
        });
        setLoading(false);
      })
      .finally(() => {
        mixpanel.logEvent(mixpanel.EventTypes.CONTRACT_INTERACTION, {
          'Method type': methodType === 'write' ? 'Write' : 'Read',
          'Method name': 'name' in data ? data.name : 'Fallback',
        });
      });
  }, [ data, methodType, onSubmit ]);

  React.useEffect(() => {
    if (isOpen && !callStrategyRef.current && attempt === 0) {
      const hasConstantOutputs = isReadMethod(data) && data.inputs.length === 0;
      if (hasConstantOutputs) {
        setCallStrategy('read');
        callStrategyRef.current = 'read';
        onFormSubmit({});
      }
    }
  }, [ data, isOpen, onFormSubmit, attempt ]);

  const handleResultSettle = React.useCallback(() => {
    setLoading(false);
  }, []);

  const handleFormChange = React.useCallback(() => {
    result && setResult(undefined);
  }, [ result ]);

  const inputs: AbiFunction['inputs'] = React.useMemo(() => {
    return [
      ...('inputs' in data && data.inputs ? data.inputs : []),
      ...('stateMutability' in data && data.stateMutability === 'payable' ? [ {
        name: `Send native ${ config.chain.currency.symbol || 'coin' }`,
        type: 'uint256' as const,
        internalType: 'uint256' as const,
        fieldType: 'native_coin' as const,
      } ] : []),
    ];
  }, [ data ]);

  const primaryButton = (() => {
    const isDisabled = !config.features.blockchainInteraction.isEnabled && methodType === 'write';
    const text = methodType === 'write' ? 'Write' : 'Read';
    const buttonCallStrategy = methodType === 'write' ? 'write' : 'read';

    return (
      <Tooltip label={ isDisabled ? NO_WALLET_CLIENT_TEXT : undefined } maxW="300px">
        <Button
          isLoading={ callStrategy === buttonCallStrategy && isLoading }
          isDisabled={ isLoading || isDisabled }
          onClick={ handleButtonClick }
          loadingText={ text }
          variant="outline"
          size="sm"
          flexShrink={ 0 }
          width="min-content"
          px={ 4 }
          type="submit"
          data-call-strategy={ buttonCallStrategy }
        >
          { text }
        </Button>
      </Tooltip>
    );
  })();

  const secondaryButton = (() => {
    if (methodType === 'read') {
      return null;
    }

    const hasOutputs = 'outputs' in data && data.outputs.length > 0;
    if (!hasOutputs) {
      return null;
    }

    const text = 'Simulate';
    const buttonCallStrategy = 'simulate';

    return (
      <Button
        isLoading={ callStrategy === buttonCallStrategy && isLoading }
        isDisabled={ isLoading }
        onClick={ handleButtonClick }
        loadingText={ text }
        variant="outline"
        size="sm"
        flexShrink={ 0 }
        width="min-content"
        px={ 4 }
        mr={ 3 }
        type="submit"
        data-call-strategy={ buttonCallStrategy }
      >
        { text }
      </Button>
    );
  })();

  return (
    <Box>
      <FormProvider { ...formApi }>
        <chakra.form
          noValidate
          onSubmit={ formApi.handleSubmit(onFormSubmit) }
          onChange={ handleFormChange }
        >
          <Flex flexDir="column" rowGap={ 3 } mb={ 6 } _empty={{ display: 'none' }}>
            { inputs.map((input, index) => {
              const props = {
                data: input,
                basePath: `${ index }`,
                isDisabled: isLoading,
                level: 0,
              };

              if ('components' in input && input.components && input.type === 'tuple') {
                return <ContractMethodFieldInputTuple key={ index } { ...props }/>;
              }

              const arrayMatch = matchArray(input.type);
              if (arrayMatch) {
                if (arrayMatch.isNested) {
                  const fieldsWithErrors = Object.keys(formApi.formState.errors);
                  const isInvalid = fieldsWithErrors.some((field) => field.startsWith(index + ':'));

                  return (
                    <ContractMethodFieldAccordion
                      key={ index }
                      level={ 0 }
                      label={ getFieldLabel(input) }
                      isInvalid={ isInvalid }
                    >
                      <ContractMethodFieldInputArray { ...props }/>
                    </ContractMethodFieldAccordion>
                  );

                }

                return <ContractMethodFieldInputArray key={ index } { ...props }/>;
              }

              return <ContractMethodFieldInput key={ index } { ...props } path={ `${ index }` }/>;
            }) }
          </Flex>
          { secondaryButton }
          { primaryButton }
          { result && !isLoading && (
            <Button
              variant="simple"
              colorScheme="blue"
              size="sm"
              onClick={ onReset }
              ml={ 1 }
            >
              <IconSvg name="repeat" boxSize={ 5 } mr={ 1 }/>
            Reset
            </Button>
          ) }
        </chakra.form>
      </FormProvider>
      { result && result.source === 'wallet_client' && (
        <ContractMethodResultWalletClient
          data={ result.data }
          onSettle={ handleResultSettle }
        />
      ) }
      { 'outputs' in data && data.outputs.length > 0 && (
        <ContractMethodResultPublicClient
          data={ result && result.source === 'public_client' ? result.data : undefined }
          onSettle={ handleResultSettle }
          abiItem={ data }
          mode={ result && result.source === 'public_client' ? 'result' : 'preview' }
        />
      ) }
    </Box>
  );
};

export default React.memo(ContractMethodForm) as typeof ContractMethodForm;
