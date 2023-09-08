import { Box, Button, chakra, Flex, Icon, Text } from '@chakra-ui/react';
import _fromPairs from 'lodash/fromPairs';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { MethodFormFields, ContractMethodCallResult } from './types';
import type { SmartContractMethodInput, SmartContractMethod } from 'types/api/contract';

import arrowIcon from 'icons/arrows/down-right.svg';
import * as mixpanel from 'lib/mixpanel/index';

import ContractMethodField from './ContractMethodField';

interface ResultComponentProps<T extends SmartContractMethod> {
  item: T;
  result: ContractMethodCallResult<T>;
  onSettle: () => void;
}

interface Props<T extends SmartContractMethod> {
  data: T;
  onSubmit: (data: T, args: Array<string | Array<unknown>>) => Promise<ContractMethodCallResult<T>>;
  resultComponent: (props: ResultComponentProps<T>) => JSX.Element | null;
  isWrite?: boolean;
}

const getFieldName = (name: string | undefined, index: number): string => name || String(index);

const sortFields = (data: Array<SmartContractMethodInput>) => ([ a ]: [string, string], [ b ]: [string, string]): 1 | -1 | 0 => {
  const fieldNames = data.map(({ name }, index) => getFieldName(name, index));
  const indexA = fieldNames.indexOf(a);
  const indexB = fieldNames.indexOf(b);

  if (indexA > indexB) {
    return 1;
  }

  if (indexA < indexB) {
    return -1;
  }

  return 0;
};

const castFieldValue = (data: Array<SmartContractMethodInput>) => ([ key, value ]: [ string, string ], index: number) => {
  if (data[index].type.includes('[')) {
    return [ key, parseArrayValue(value) ];
  }
  return [ key, value ];
};

const parseArrayValue = (value: string) => {
  try {
    const parsedResult = JSON.parse(value);
    if (Array.isArray(parsedResult)) {
      return parsedResult;
    }
    throw new Error('Not an array');
  } catch (error) {
    return '';
  }
};

const ContractMethodCallable = <T extends SmartContractMethod>({ data, onSubmit, resultComponent: ResultComponent, isWrite }: Props<T>) => {

  const [ result, setResult ] = React.useState<ContractMethodCallResult<T>>();
  const [ isLoading, setLoading ] = React.useState(false);

  const inputs: Array<SmartContractMethodInput> = React.useMemo(() => {
    return [
      ...('inputs' in data ? data.inputs : []),
      ...('stateMutability' in data && data.stateMutability === 'payable' ? [ {
        name: 'value',
        type: 'uint256' as const,
        internalType: 'uint256' as const,
      } ] : []),
    ];
  }, [ data ]);

  const { control, handleSubmit, setValue, getValues } = useForm<MethodFormFields>({
    defaultValues: _fromPairs(inputs.map(({ name }, index) => [ getFieldName(name, index), '' ])),
  });

  const handleTxSettle = React.useCallback(() => {
    setLoading(false);
  }, []);

  const handleFormChange = React.useCallback(() => {
    result && setResult(undefined);
  }, [ result ]);

  const onFormSubmit: SubmitHandler<MethodFormFields> = React.useCallback(async(formData) => {
    const args = Object.entries(formData)
      .sort(sortFields(inputs))
      .map(castFieldValue(inputs))
      .map(([ , value ]) => value);

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
          'Method type': isWrite ? 'Write' : 'Read',
          'Method name': 'name' in data ? data.name : 'Fallback',
        });
      });
  }, [ inputs, onSubmit, data, isWrite ]);

  return (
    <Box>
      <chakra.form
        noValidate
        display="flex"
        columnGap={ 3 }
        flexDir={{ base: 'column', lg: 'row' }}
        rowGap={ 2 }
        alignItems={{ base: 'flex-start', lg: 'center' }}
        onSubmit={ handleSubmit(onFormSubmit) }
        flexWrap="wrap"
        onChange={ handleFormChange }
      >
        { inputs.map(({ type, name }, index) => {
          const fieldName = getFieldName(name, index);
          return (
            <ContractMethodField
              key={ fieldName }
              name={ fieldName }
              valueType={ type }
              placeholder={ `${ name }(${ type })` }
              control={ control }
              setValue={ setValue }
              getValues={ getValues }
              isDisabled={ isLoading }
              onChange={ handleFormChange }
            />
          );
        }) }
        <Button
          isLoading={ isLoading }
          loadingText={ isWrite ? 'Write' : 'Query' }
          variant="outline"
          size="sm"
          flexShrink={ 0 }
          type="submit"
        >
          { isWrite ? 'Write' : 'Query' }
        </Button>
      </chakra.form>
      { 'outputs' in data && !isWrite && data.outputs.length > 0 && (
        <Flex mt={ 3 }>
          <Icon as={ arrowIcon } boxSize={ 5 } mr={ 1 }/>
          <Text>{ data.outputs.map(({ type }) => type).join(', ') }</Text>
        </Flex>
      ) }
      { result && <ResultComponent item={ data } result={ result } onSettle={ handleTxSettle }/> }
    </Box>
  );
};

export default React.memo(ContractMethodCallable) as typeof ContractMethodCallable;
