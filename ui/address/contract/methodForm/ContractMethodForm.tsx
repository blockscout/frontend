import { Box, Button, Flex, chakra } from '@chakra-ui/react';
import _mapValues from 'lodash/mapValues';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';

import type { ContractMethodCallResult } from '../types';
import type { ResultComponentProps } from './types';
import type { SmartContractMethod, SmartContractMethodInput } from 'types/api/contract';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';

import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';
import ContractMethodFormOutputs from './ContractMethodFormOutputs';
import { ARRAY_REGEXP, transformFormDataToMethodArgs } from './utils';
import type { ContractMethodFormFields } from './utils';

interface Props<T extends SmartContractMethod> {
  data: T;
  onSubmit: (data: T, args: Array<unknown>) => Promise<ContractMethodCallResult<T>>;
  resultComponent: (props: ResultComponentProps<T>) => JSX.Element | null;
  methodType: 'read' | 'write';
}

const ContractMethodForm = <T extends SmartContractMethod>({ data, onSubmit, resultComponent: ResultComponent, methodType }: Props<T>) => {

  const [ result, setResult ] = React.useState<ContractMethodCallResult<T>>();
  const [ isLoading, setLoading ] = React.useState(false);

  const formApi = useForm<ContractMethodFormFields>({
    mode: 'all',
    shouldUnregister: true,
  });

  const onFormSubmit: SubmitHandler<ContractMethodFormFields> = React.useCallback(async(formData) => {
    // The API used for reading from contracts expects all values to be strings.
    const formattedData = methodType === 'read' ?
      _mapValues(formData, (value) => value !== undefined ? String(value) : undefined) :
      formData;
    const args = transformFormDataToMethodArgs(formattedData);

    setResult(undefined);
    setLoading(true);

    onSubmit(data, args)
      .then((result) => {
        setResult(result);
      })
      .catch((error) => {
        setResult(error?.error || error?.data || (error?.reason && { message: error.reason }) || error);
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

  const inputs: Array<SmartContractMethodInput> = React.useMemo(() => {
    return [
      ...('inputs' in data ? data.inputs : []),
      ...('stateMutability' in data && data.stateMutability === 'payable' ? [ {
        name: `Send native ${ config.chain.currency.symbol || 'coin' }`,
        type: 'uint256' as const,
        internalType: 'uint256' as const,
        fieldType: 'native_coin' as const,
      } ] : []),
    ];
  }, [ data ]);

  const outputs = 'outputs' in data && data.outputs ? data.outputs : [];

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
              if (input.components && input.type === 'tuple') {
                return <ContractMethodFieldInputTuple key={ index } data={ input } basePath={ `${ index }` } level={ 0 } isDisabled={ isLoading }/>;
              }

              const arrayMatch = input.type.match(ARRAY_REGEXP);
              if (arrayMatch) {
                return <ContractMethodFieldInputArray key={ index } data={ input } basePath={ `${ index }` } level={ 0 } isDisabled={ isLoading }/>;
              }

              return <ContractMethodFieldInput key={ index } data={ input } path={ `${ index }` } isDisabled={ isLoading } level={ 0 }/>;
            }) }
          </Flex>
          <Button
            isLoading={ isLoading }
            loadingText={ methodType === 'write' ? 'Write' : 'Read' }
            variant="outline"
            size="sm"
            flexShrink={ 0 }
            width="min-content"
            px={ 4 }
            type="submit"
          >
            { methodType === 'write' ? 'Write' : 'Read' }
          </Button>
        </chakra.form>
      </FormProvider>
      { methodType === 'read' && <ContractMethodFormOutputs data={ outputs }/> }
      { result && <ResultComponent item={ data } result={ result } onSettle={ handleTxSettle }/> }
    </Box>
  );
};

export default React.memo(ContractMethodForm) as typeof ContractMethodForm;
