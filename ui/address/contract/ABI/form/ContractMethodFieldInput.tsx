import { Box, Flex, FormControl, Input, InputGroup, InputRightElement, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import type { ContractAbiItemInput } from '../types';

import ClearButton from 'ui/shared/ClearButton';

import ContractMethodFieldLabel from './ContractMethodFieldLabel';
import ContractMethodMultiplyButton from './ContractMethodMultiplyButton';
import useFormatFieldValue from './useFormatFieldValue';
import useValidateField from './useValidateField';
import { matchInt } from './utils';

interface Props {
  data: ContractAbiItemInput;
  hideLabel?: boolean;
  path: string;
  className?: string;
  isDisabled: boolean;
  isOptional?: boolean;
  level: number;
}

const ContractMethodFieldInput = ({ data, hideLabel, path: name, className, isDisabled, isOptional: isOptionalProp, level }: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const isNativeCoin = data.fieldType === 'native_coin';
  const isOptional = isOptionalProp || isNativeCoin;

  const argTypeMatchInt = React.useMemo(() => matchInt(data.type), [ data.type ]);
  const validate = useValidateField({ isOptional, argType: data.type, argTypeMatchInt });
  const format = useFormatFieldValue({ argType: data.type, argTypeMatchInt });

  const { control, setValue, getValues } = useFormContext();
  const { field, fieldState } = useController({ control, name, rules: { validate } });

  const inputBgColor = useColorModeValue('white', 'black');
  const nativeCoinRowBgColor = useColorModeValue('gray.100', 'gray.700');

  const hasMultiplyButton = argTypeMatchInt && Number(argTypeMatchInt.power) >= 64;

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = format(event.target.value);
    field.onChange(formattedValue); // data send back to hook form
    setValue(name, formattedValue); // UI state
  }, [ field, name, setValue, format ]);

  const handleClear = React.useCallback(() => {
    setValue(name, '');
    ref.current?.focus();
  }, [ name, setValue ]);

  const handleMultiplyButtonClick = React.useCallback((power: number) => {
    const zeroes = Array(power).fill('0').join('');
    const value = getValues(name);
    const newValue = format(value ? value + zeroes : '1' + zeroes);
    setValue(name, newValue);
  }, [ format, getValues, name, setValue ]);

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
            onChange={ handleChange }
            required={ !isOptional }
            isInvalid={ Boolean(error) }
            placeholder={ data.type }
            autoComplete="off"
            bgColor={ inputBgColor }
            paddingRight={ hasMultiplyButton ? '120px' : '40px' }
          />
          <InputRightElement w="auto" right={ 1 }>
            { field.value !== undefined && field.value !== '' && <ClearButton onClick={ handleClear } isDisabled={ isDisabled }/> }
            { hasMultiplyButton && <ContractMethodMultiplyButton onClick={ handleMultiplyButtonClick } isDisabled={ isDisabled }/> }
          </InputRightElement>
        </InputGroup>
        { error && <Box color="error" fontSize="sm" lineHeight={ 5 } mt={ 1 }>{ error.message }</Box> }
      </FormControl>
    </Flex>
  );
};

export default React.memo(chakra(ContractMethodFieldInput));
