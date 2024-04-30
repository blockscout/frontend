import { Box, Button, Flex, chakra } from '@chakra-ui/react';
import _mapValues from 'lodash/mapValues';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import type { AbiFunction } from 'viem';

import type { FormSubmitHandler, FormSubmitResult, FormSubmitType, MethodType, ContractAbiItem } from '../types';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';

import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';
import ContractMethodFormOutputs from './ContractMethodFormOutputs';
import ContractMethodFormResult from './ContractMethodFormResult';
import { ARRAY_REGEXP, transformFormDataToMethodArgs } from './utils';
import type { ContractMethodFormFields } from './utils';

interface Props {
  data: ContractAbiItem;
  onSubmit: FormSubmitHandler;
  methodType: MethodType;
}

const ContractMethodForm = ({ data, onSubmit, methodType }: Props) => {

  const [ result, setResult ] = React.useState<FormSubmitResult>();
  const [ isLoading, setLoading ] = React.useState(false);
  const [ submitType, setSubmitType ] = React.useState<FormSubmitType>();
  const submitTypeRef = React.useRef(submitType);

  const formApi = useForm<ContractMethodFormFields>({
    mode: 'all',
    shouldUnregister: true,
  });

  const handleButtonClick = React.useCallback((event: React.MouseEvent) => {
    const submitType = event?.currentTarget.getAttribute('data-submit-type');
    setSubmitType(submitType as FormSubmitType);
    submitTypeRef.current = submitType as FormSubmitType;
  }, []);

  const onFormSubmit: SubmitHandler<ContractMethodFormFields> = React.useCallback(async(formData) => {
    // The API used for reading from contracts expects all values to be strings.
    const formattedData = methodType === 'read' ?
      _mapValues(formData, (value) => value !== undefined ? String(value) : undefined) :
      formData;
    const args = transformFormDataToMethodArgs(formattedData);

    setResult(undefined);
    setLoading(true);

    onSubmit(data, args, submitTypeRef.current)
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
              if ('components' in input && input.components && input.type === 'tuple') {
                return <ContractMethodFieldInputTuple key={ index } data={ input } basePath={ `${ index }` } level={ 0 } isDisabled={ isLoading }/>;
              }

              const arrayMatch = input.type.match(ARRAY_REGEXP);
              if (arrayMatch) {
                return <ContractMethodFieldInputArray key={ index } data={ input } basePath={ `${ index }` } level={ 0 } isDisabled={ isLoading }/>;
              }

              return <ContractMethodFieldInput key={ index } data={ input } path={ `${ index }` } isDisabled={ isLoading } level={ 0 }/>;
            }) }
          </Flex>
          { methodType === 'write' && 'outputs' in data && Boolean(data.outputs?.length) && (
            <Button
              isLoading={ submitType === 'simulate' && isLoading }
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
              data-submit-type="simulate"
            >
              Simulate
            </Button>
          ) }
          <Button
            isLoading={ submitType === 'call' && isLoading }
            isDisabled={ isLoading }
            onClick={ handleButtonClick }
            loadingText={ methodType === 'write' ? 'Write' : 'Read' }
            variant="outline"
            size="sm"
            flexShrink={ 0 }
            width="min-content"
            px={ 4 }
            type="submit"
            data-submit-type="call"
          >
            { methodType === 'write' ? 'Write' : 'Read' }
          </Button>
        </chakra.form>
      </FormProvider>
      { methodType === 'read' && <ContractMethodFormOutputs data={ outputs }/> }
      { Boolean(result) && <ContractMethodFormResult abiItem={ data } result={ result } onSettle={ handleTxSettle }/> }
    </Box>
  );
};

export default React.memo(ContractMethodForm) as typeof ContractMethodForm;
