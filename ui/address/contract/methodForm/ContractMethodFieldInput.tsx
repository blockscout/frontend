import { Box, Flex, FormControl, Input, InputGroup, InputRightElement, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import type { SmartContractMethodInput } from 'types/api/contract';

import ClearButton from 'ui/shared/ClearButton';

import ContractMethodFieldLabel from './ContractMethodFieldLabel';
import ContractMethodMultiplyButton from './ContractMethodMultiplyButton';
import useArgTypeMatchInt from './useArgTypeMatchInt';
import useValidateField from './useValidateField';

interface Props {
  data: SmartContractMethodInput;
  hideLabel?: boolean;
  path: string;
  className?: string;
  isDisabled: boolean;
  level: number;
}

const ContractMethodFieldInput = ({ data, hideLabel, path: name, className, isDisabled, level }: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const isNativeCoin = data.fieldType === 'native_coin';
  const isOptional = isNativeCoin;

  const argTypeMatchInt = useArgTypeMatchInt({ argType: data.type });
  const validate = useValidateField({ isOptional, argType: data.type, argTypeMatchInt });

  const { control, setValue, getValues } = useFormContext();
  const { field, fieldState } = useController({ control, name, rules: { validate, required: isOptional ? false : 'Field is required' } });

  const inputBgColor = useColorModeValue('white', 'black');
  const nativeCoinRowBgColor = useColorModeValue('gray.100', 'gray.700');

  const hasMultiplyButton = argTypeMatchInt && Number(argTypeMatchInt.power) >= 64;

  const handleClear = React.useCallback(() => {
    setValue(name, '');
    ref.current?.focus();
  }, [ name, setValue ]);

  const handleMultiplyButtonClick = React.useCallback((power: number) => {
    const zeroes = Array(power).fill('0').join('');
    const value = getValues(name);
    const newValue = value ? value + zeroes : '1' + zeroes;
    setValue(name, newValue);
  }, [ getValues, name, setValue ]);

  const error = fieldState.error;

  return (
    <Flex
      className={ className }
      flexDir={{ base: 'column', md: 'row' }}
      alignItems="flex-start"
      columnGap={ 3 }
      w="100%"
      bgColor={ isNativeCoin ? nativeCoinRowBgColor : undefined }
      borderRadius="base"
      px="6px"
      py={ isNativeCoin ? 1 : 0 }
    >
      { !hideLabel && <ContractMethodFieldLabel data={ data } isOptional={ isOptional } level={ level }/> }
      <FormControl isDisabled={ isDisabled }>
        <InputGroup size="xs">
          <Input
            { ...field }
            { ...(argTypeMatchInt ? {
              as: NumericFormat,
              thousandSeparator: ' ',
              decimalScale: 0,
              allowNegative: !argTypeMatchInt.isUnsigned,
            } : {}) }
            ref={ ref }
            required={ !isOptional }
            isInvalid={ Boolean(error) }
            placeholder={ data.type }
            autoComplete="off"
            bgColor={ inputBgColor }
            paddingRight={ hasMultiplyButton ? '120px' : '40px' }
          />
          <InputRightElement w="auto" right={ 1 }>
            { typeof field.value === 'string' && field.value.replace('\n', '') && <ClearButton onClick={ handleClear } isDisabled={ isDisabled }/> }
            { hasMultiplyButton && <ContractMethodMultiplyButton onClick={ handleMultiplyButtonClick } isDisabled={ isDisabled }/> }
          </InputRightElement>
        </InputGroup>
        { error && <Box color="error" fontSize="sm" lineHeight={ 5 } mt={ 1 }>{ error.message }</Box> }
      </FormControl>
    </Flex>
  );
};

export default React.memo(chakra(ContractMethodFieldInput));
