import { Box, Button, chakra, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import _fromPairs from 'lodash/fromPairs';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { MethodFormFields } from './types';
import type { SmartContractMethodInput, SmartContractMethod } from 'types/api/contract';

import appConfig from 'configs/app/config';
import arrowIcon from 'icons/arrows/down-right.svg';

import ContractMethodField from './ContractMethodField';

interface Props<T extends SmartContractMethod> {
  data: T;
  caller: (data: T, args: Array<string>) => Promise<Array<Array<string>>>;
  isWrite?: boolean;
}

const getFieldName = (name: string, index: number): string => name || String(index);

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

const ContractMethodCallable = <T extends SmartContractMethod>({ data, caller, isWrite }: Props<T>) => {

  const inputs = React.useMemo(() => {
    return data.payable && (!('inputs' in data) || data.inputs.length === 0) ? [ {
      name: 'value',
      type: appConfig.network.currency.symbol,
      internalType: appConfig.network.currency.symbol,
    } as SmartContractMethodInput ] : data.inputs;
  }, [ data ]);

  const { control, handleSubmit, setValue } = useForm<MethodFormFields>({
    defaultValues: _fromPairs(inputs.map(({ name }, index) => [ getFieldName(name, index), '' ])),
  });
  const [ result, setResult ] = React.useState<Array<Array<string>>>([ ]);

  const onSubmit: SubmitHandler<MethodFormFields> = React.useCallback(async(formData) => {
    const args = Object.entries(formData)
      .sort(sortFields(inputs))
      .map(([ , value ]) => value);

    const result = await caller(data, args);
    setResult(result);

  }, [ caller, data, inputs ]);

  const resultBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Box>
      <chakra.form
        noValidate
        display="flex"
        columnGap={ 3 }
        flexDir={{ base: 'column', lg: 'row' }}
        rowGap={ 2 }
        alignItems={{ base: 'flex-start', lg: 'center' }}
        onSubmit={ handleSubmit(onSubmit) }
        flexWrap="wrap"
      >
        { inputs.map(({ type, name }, index) => {
          const fieldName = getFieldName(name, index);
          return (
            <ContractMethodField
              key={ fieldName }
              name={ fieldName }
              placeholder={ `${ name }(${ type })` }
              control={ control }
              setValue={ setValue }
            />
          );
        }) }
        <Button
          variant="outline"
          size="sm"
          flexShrink={ 0 }
          type="submit"
        >
          { isWrite ? 'Write' : 'Query' }
        </Button>
      </chakra.form>
      { 'outputs' in data && data.outputs.length > 0 && (
        <Flex mt={ 3 }>
          <Icon as={ arrowIcon } boxSize={ 5 } mr={ 1 }/>
          <Text>{ data.outputs.map(({ type }) => type).join(', ') }</Text>
        </Flex>
      ) }
      { result.length > 0 && (
        <Box mt={ 3 } p={ 4 } borderRadius="md" bgColor={ resultBgColor } fontSize="sm">
          <p>
          [ <chakra.span fontWeight={ 600 }>{ 'name' in data ? data.name : '' }</chakra.span> method response ]
          </p>
          <p>[</p>
          { result.map(([ key, value ], index) => (
            <chakra.p key={ index } whiteSpace="break-spaces" wordBreak="break-all">  { key }: { value }</chakra.p>
          )) }
          <p>]</p>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(ContractMethodCallable) as typeof ContractMethodCallable;
