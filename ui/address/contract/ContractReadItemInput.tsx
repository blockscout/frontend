import { Box, Button, chakra, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import _fromPairs from 'lodash/fromPairs';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { MethodInputFields } from './types';
import type { SmartContract, SmartContractMethodInput, SmartContractMethodOutput } from 'types/api/contract';

import arrowIcon from 'icons/arrows/down-right.svg';
import useApiFetch from 'lib/api/useApiFetch';

import ContractReadItemInputField from './ContractReadItemInputField';

interface Props {
  data: Array<SmartContractMethodInput>;
  address?: string;
  abi?: SmartContract['abi'];
  methodName: string;
  methodId: string;
  outputs: Array<SmartContractMethodOutput>;
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

const ContractReadItemInput = ({ data, address, methodId, methodName, outputs }: Props) => {
  const { control, handleSubmit, setValue } = useForm<MethodInputFields>({
    defaultValues: _fromPairs(data.map(({ name }, index) => [ getFieldName(name, index), '' ])),
  });
  const apiFetch = useApiFetch();
  const [ result, setResult ] = React.useState<Array<[ string, string ]>>([ ]);

  const onSubmit: SubmitHandler<MethodInputFields> = React.useCallback(async(formData) => {
    if (!address) {
      return;
    }

    const args = Object.entries(formData)
      .sort(sortFields(data))
      .map(([ , value ]) => value);

    // todo_tom delete mock
    setResult(outputs.map(({ type }, index) => ([ type, args[index] ])));

    await apiFetch('contract_method_query', {
      pathParams: { id: address },
      fetchParams: {
        method: 'POST',
        body: {
          args,
          method_id: methodId,
        },
      },
    });
  }, [ address, apiFetch, data, methodId, outputs ]);

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
        { data.map(({ type, name }, index) => {
          const fieldName = getFieldName(name, index);
          return (
            <ContractReadItemInputField
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
          Query
        </Button>
      </chakra.form>
      <Flex mt={ 3 }>
        <Icon as={ arrowIcon } boxSize={ 5 } mr={ 1 }/>
        <Text>{ outputs.map(({ type }) => type).join(', ') }</Text>
      </Flex>
      { result.length > 0 && (
        <Box mt={ 3 } p={ 4 } borderRadius="md" bgColor={ resultBgColor } fontSize="sm">
          <p>
          [ <chakra.span fontWeight={ 600 }>{ methodName }</chakra.span> method Response ]
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

export default ContractReadItemInput;
