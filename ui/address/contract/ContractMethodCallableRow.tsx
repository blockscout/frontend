import { Box, useColorModeValue } from '@chakra-ui/react';
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
      type={ fieldType }
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
    <>
      <Box
        position="relative"
        fontWeight={ 500 }
        lineHeight="20px"
        pt={{ base: isNativeCoinField ? '6px' : 0, lg: isNativeCoinField ? '10px' : '6px' }}
        pb={{ lg: isNativeCoinField ? '10px' : '6px' }}
        fontSize="sm"
        color={ isGrouped ? 'text_secondary' : 'initial' }
        wordBreak="break-word"
        _before={ isNativeCoinField ? {
          content: `" "`,
          position: 'absolute',
          top: 0,
          left: '-6px',
          width: { base: 'calc(100% + 12px)', lg: 'calc(100% + 18px)' },
          height: { base: 'calc(100% + 8px)', lg: '100%' },
          bgColor: nativeCoinFieldBgColor,
          borderTopLeftRadius: 'base',
          borderTopRightRadius: { base: 'base', lg: 'none' },
          borderBottomRightRadius: 'none',
          borderBottomLeftRadius: { base: 'none', lg: 'base' },
          zIndex: -1,
        } : undefined }
      >
        { argName }{ isOptional ? '' : '*' } ({ argType })
      </Box>
      { content }
    </>
  );
};

export default React.memo(ContractMethodCallableRow);
