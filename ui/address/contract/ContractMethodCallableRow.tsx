import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { MethodFormFields } from './types';
import type { SmartContractMethodArgType, SmartContractMethodInput } from 'types/api/contract';

import ContractMethodField from './ContractMethodField';
import ContractMethodFieldArray from './ContractMethodFieldArray';
import { ARRAY_REGEXP } from './utils';

interface Props {
  fieldName: string;
  fieldType?: SmartContractMethodInput['fieldType'];
  argName: string;
  argType: SmartContractMethodArgType;
  onChange: () => void;
  isDisabled: boolean;
  isGrouped?: boolean;
  isOptional?: boolean;
}

const ContractMethodCallableRow = ({ argName, fieldName, fieldType, argType, onChange, isDisabled, isGrouped, isOptional }: Props) => {
  const { control, getValues, setValue } = useFormContext<MethodFormFields>();
  const arrayTypeMatch = argType.match(ARRAY_REGEXP);
  const nativeCoinFieldBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.100');

  const content = arrayTypeMatch ? (
    <ContractMethodFieldArray
      name={ fieldName }
      argType={ arrayTypeMatch[1] as SmartContractMethodArgType }
      size={ Number(arrayTypeMatch[2] || Infinity) }
      control={ control }
      setValue={ setValue }
      getValues={ getValues }
      isDisabled={ isDisabled }
      onChange={ onChange }
    />
  ) : (
    <ContractMethodField
      name={ fieldName }
      argType={ argType }
      placeholder={ argType }
      control={ control }
      setValue={ setValue }
      getValues={ getValues }
      isDisabled={ isDisabled }
      isOptional={ isOptional }
      onChange={ onChange }
    />
  );

  const isNativeCoinField = fieldType === 'native_coin';

  return (
    <Flex
      flexDir={{ base: 'column', lg: 'row' }}
      columnGap={ 3 }
      rowGap={{ base: 2, lg: 0 }}
      bgColor={ isNativeCoinField ? nativeCoinFieldBgColor : undefined }
      py={ isNativeCoinField ? 1 : undefined }
      px={ isNativeCoinField ? '6px' : undefined }
      mx={ isNativeCoinField ? '-6px' : undefined }
      borderRadius="base"
    >
      <Box
        position="relative"
        fontWeight={ 500 }
        lineHeight="20px"
        py={{ lg: '6px' }}
        fontSize="sm"
        color={ isGrouped ? 'text_secondary' : 'initial' }
        wordBreak="break-word"
        w={{ lg: '250px' }}
        flexShrink={ 0 }
      >
        { argName }{ isOptional ? '' : '*' } ({ argType })
      </Box>
      { content }
    </Flex>
  );
};

export default React.memo(ContractMethodCallableRow);
