import { Box, Button, Flex, FormControl, Input, InputGroup, InputRightElement, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import type { ContractAbiItemInput } from '../types';

import { HOUR, SECOND } from 'lib/consts';
import ClearButton from 'ui/shared/ClearButton';

import ContractMethodAddressButton from './ContractMethodAddressButton';
import ContractMethodFieldLabel from './ContractMethodFieldLabel';
import ContractMethodMultiplyButton from './ContractMethodMultiplyButton';
import useFormatFieldValue from './useFormatFieldValue';
import useValidateField from './useValidateField';
import { matchInt } from './utils';

const TIMESTAMP_BUTTON_REGEXP = /time|deadline|expiration|expiry/i;

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
  const hasTimestampButton = React.useMemo(() => TIMESTAMP_BUTTON_REGEXP.test(data.name || ''), [ data.name ]);
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
    setValue(name, newValue, { shouldValidate: true });
  }, [ format, getValues, name, setValue ]);

  const handleMaxIntButtonClick = React.useCallback(() => {
    if (!argTypeMatchInt) {
      return;
    }

    const newValue = format(argTypeMatchInt.max.toString());
    setValue(name, newValue, { shouldValidate: true });
  }, [ format, name, setValue, argTypeMatchInt ]);

  const handleAddressButtonClick = React.useCallback((address: string) => {
    const newValue = format(address);
    setValue(name, newValue, { shouldValidate: true });
  }, [ format, name, setValue ]);

  const handleTimestampButtonClick = React.useCallback(() => {
    const newValue = format(String(Math.floor((Date.now() + HOUR) / SECOND)));
    setValue(name, newValue, { shouldValidate: true });
  }, [ format, name, setValue ]);

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
            data-1p-ignore
            bgColor={ inputBgColor }
            paddingRight={ hasMultiplyButton ? '120px' : '40px' }
          />
          <InputRightElement w="auto" right={ 1 } bgColor={ inputBgColor } h="calc(100% - 4px)" top="2px" borderRadius="base">
            { field.value !== undefined && field.value !== '' && <ClearButton onClick={ handleClear } isDisabled={ isDisabled }/> }
            { data.type === 'address' && <ContractMethodAddressButton onClick={ handleAddressButtonClick } isDisabled={ isDisabled }/> }
            { argTypeMatchInt && !isNativeCoin && (hasTimestampButton ? (
              <Button
                variant="subtle"
                colorScheme="gray"
                size="xs"
                fontSize="normal"
                fontWeight={ 500 }
                ml={ 1 }
                onClick={ handleTimestampButtonClick }
                isDisabled={ isDisabled }
              >
                Now+1h
              </Button>
            ) : (
              <Button
                variant="subtle"
                colorScheme="gray"
                size="xs"
                fontSize="normal"
                fontWeight={ 500 }
                ml={ 1 }
                onClick={ handleMaxIntButtonClick }
                isDisabled={ isDisabled }
              >
                Max
              </Button>
            )) }
            { hasMultiplyButton && <ContractMethodMultiplyButton onClick={ handleMultiplyButtonClick } isDisabled={ isDisabled }/> }
          </InputRightElement>
        </InputGroup>
        { error && <Box color="error" fontSize="sm" lineHeight={ 5 } mt={ 1 }>{ error.message }</Box> }
      </FormControl>
    </Flex>
  );
};

export default React.memo(chakra(ContractMethodFieldInput));
