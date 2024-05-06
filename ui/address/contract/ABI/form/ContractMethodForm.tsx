import { Box, Button, Flex, Tooltip, chakra } from '@chakra-ui/react';
import _mapValues from 'lodash/mapValues';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import type { AbiFunction } from 'viem';

import type { FormSubmitHandler, FormSubmitResult, MethodCallStrategy, MethodType, ContractAbiItem } from '../types';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';

import ContractMethodFieldAccordion from './ContractMethodFieldAccordion';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';
import ContractMethodOutputs from './ContractMethodOutputs';
import ContractMethodResult from './ContractMethodResult';
import { getFieldLabel, matchArray, transformFormDataToMethodArgs } from './utils';
import type { ContractMethodFormFields } from './utils';

interface Props {
  data: ContractAbiItem;
  onSubmit: FormSubmitHandler;
  methodType: MethodType;
}

const ContractMethodForm = ({ data, onSubmit, methodType }: Props) => {

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

  const onFormSubmit: SubmitHandler<ContractMethodFormFields> = React.useCallback(async(formData) => {
    // The API used for reading from contracts expects all values to be strings.
    const formattedData = callStrategyRef.current === 'api' ?
      _mapValues(formData, (value) => value !== undefined ? String(value) : undefined) :
      formData;
    const args = transformFormDataToMethodArgs(formattedData);

    setResult(undefined);
    setLoading(true);

    onSubmit(data, args, callStrategyRef.current)
      .then((result) => {
        setResult(result);
      })
      .catch((error) => {
        setResult({
          source: callStrategyRef.current ?? 'wallet_client',
          result: error?.error || error?.data || (error?.reason && { message: error.reason }) || error,
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

  const handleTxSettle = React.useCallback(() => {
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

  const outputs = 'outputs' in data && data.outputs ? data.outputs : [];

  const callStrategies = (() => {
    switch (methodType) {
      case 'read': {
        return { primary: 'api', secondary: undefined };
      }

      case 'write': {
        return {
          primary: config.features.blockchainInteraction.isEnabled ? 'wallet_client' : undefined,
          secondary: 'outputs' in data && Boolean(data.outputs?.length) ? 'api' : undefined,
        };
      }

      default: {
        return { primary: undefined, secondary: undefined };
      }
    }
  })();

  // eslint-disable-next-line max-len
  const noWalletClientText = 'Blockchain interaction is not available at the moment since WalletConnect is not configured for this application. Please contact the service maintainer to make necessary changes in the service configuration.';

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
          { callStrategies.secondary && (
            <Button
              isLoading={ callStrategy === callStrategies.secondary && isLoading }
              isDisabled={ isLoading }
              onClick={ handleButtonClick }
              loadingText="Simulate"
              variant="outline"
              size="sm"
              flexShrink={ 0 }
              width="min-content"
              px={ 4 }
              mr={ 3 }
              type="submit"
              data-call-strategy={ callStrategies.secondary }
            >
              Simulate
            </Button>
          ) }
          <Tooltip label={ !callStrategies.primary ? noWalletClientText : undefined } maxW="300px">
            <Button
              isLoading={ callStrategy === callStrategies.primary && isLoading }
              isDisabled={ isLoading || !callStrategies.primary }
              onClick={ handleButtonClick }
              loadingText={ methodType === 'write' ? 'Write' : 'Read' }
              variant="outline"
              size="sm"
              flexShrink={ 0 }
              width="min-content"
              px={ 4 }
              type="submit"
              data-call-strategy={ callStrategies.primary }
            >
              { methodType === 'write' ? 'Write' : 'Read' }
            </Button>
          </Tooltip>
        </chakra.form>
      </FormProvider>
      { 'outputs' in data && Boolean(data.outputs?.length) && <ContractMethodOutputs data={ outputs }/> }
      { result && <ContractMethodResult abiItem={ data } result={ result } onSettle={ handleTxSettle }/> }
    </Box>
  );
};

export default React.memo(ContractMethodForm) as typeof ContractMethodForm;
