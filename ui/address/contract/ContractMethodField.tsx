import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, UseFormGetValues, UseFormSetValue, UseFormStateReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { isAddress } from 'viem';

import type { MethodFormFields } from './types';
import type { SmartContractMethodArgType } from 'types/api/contract';

import stringToBytes from 'lib/stringToBytes';
import ClearButton from 'ui/shared/ClearButton';

import ContractMethodFieldZeroes from './ContractMethodFieldZeroes';
import { INT_REGEXP, BYTES_REGEXP, getIntBoundaries, formatBooleanValue } from './utils';

interface Props {
  control: Control<MethodFormFields>;
  setValue: UseFormSetValue<MethodFormFields>;
  getValues: UseFormGetValues<MethodFormFields>;
  placeholder: string;
  name: string;
  valueType: SmartContractMethodArgType;
  isDisabled: boolean;
  onChange: () => void;
}

const ContractMethodField = ({ control, name, valueType, placeholder, setValue, getValues, isDisabled, onChange }: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const handleClear = React.useCallback(() => {
    setValue(name, '');
    onChange();
    ref.current?.focus();
  }, [ name, onChange, setValue ]);

  const handleAddZeroesClick = React.useCallback((power: number) => {
    const value = getValues()[name];
    const zeroes = Array(power).fill('0').join('');
    const newValue = value ? value + zeroes : '1' + zeroes;
    setValue(name, newValue);
    onChange();
  }, [ getValues, name, onChange, setValue ]);

  const intMatch = React.useMemo(() => {
    const match = valueType.match(INT_REGEXP);
    if (!match) {
      return null;
    }

    const [ , isUnsigned, power = '256' ] = match;
    const [ min, max ] = getIntBoundaries(Number(power), Boolean(isUnsigned));

    return { isUnsigned, power, min, max };
  }, [ valueType ]);

  const bytesMatch = React.useMemo(() => {
    return valueType.match(BYTES_REGEXP);
  }, [ valueType ]);

  const renderInput = React.useCallback((
    { field, formState }: { field: ControllerRenderProps<MethodFormFields>; formState: UseFormStateReturn<MethodFormFields> },
  ) => {
    const error = formState.errors[name];
    // show control for all inputs which allows to insert 10^18 or greater numbers
    const hasZerosControl = intMatch && Number(intMatch.power) >= 64;

    return (
      <Box>
        <FormControl
          id={ name }
          w="100%"
          mb={{ base: 1, lg: 0 }}
          isDisabled={ isDisabled }
        >
          <InputGroup size="xs">
            <Input
              { ...field }
              { ...(intMatch ? {
                as: NumericFormat,
                thousandSeparator: ' ',
                decimalScale: 0,
                allowNegative: !intMatch.isUnsigned,
              } : {}) }
              ref={ ref }
              isInvalid={ Boolean(error) }
              required
              placeholder={ placeholder }
              paddingRight={ hasZerosControl ? '120px' : '40px' }
              autoComplete="off"
            />
            <InputRightElement w="auto" right={ 1 }>
              { field.value && <ClearButton onClick={ handleClear } isDisabled={ isDisabled }/> }
              { hasZerosControl && <ContractMethodFieldZeroes onClick={ handleAddZeroesClick } isDisabled={ isDisabled }/> }
            </InputRightElement>
          </InputGroup>
        </FormControl>
        { error && <Box color="error" fontSize="sm" mt={ 1 }>{ error.message }</Box> }
      </Box>
    );
  }, [ name, intMatch, isDisabled, placeholder, handleClear, handleAddZeroesClick ]);

  const validate = React.useCallback((value: string) => {
    if (valueType === 'address') {
      return !isAddress(value) ? 'Invalid address format' : true;
    }

    if (intMatch) {
      const formattedValue = Number(value.replace(/\s/g, ''));

      if (Object.is(formattedValue, NaN)) {
        return 'Invalid integer format';
      }

      if (formattedValue > intMatch.max || formattedValue < intMatch.min) {
        const lowerBoundary = intMatch.isUnsigned ? '0' : `-1 * 2 ^ ${ Number(intMatch.power) / 2 }`;
        const upperBoundary = intMatch.isUnsigned ? `2 ^ ${ intMatch.power } - 1` : `2^${ Number(intMatch.power) / 2 } - 1`;
        return `Value should be in range from "${ lowerBoundary }" to "${ upperBoundary }" inclusively`;
      }

      return true;
    }

    if (valueType === 'bool') {
      const formattedValue = formatBooleanValue(value);
      if (formattedValue === undefined) {
        return 'Invalid boolean format. Allowed values: 0, 1, true, false';
      }
    }

    if (bytesMatch) {
      const [ , length ] = bytesMatch;

      if (value.startsWith('0x')) {
        if (value.replace('0x', '').length % 2 !== 0) {
          return 'Invalid bytes format';
        }
      }

      if (length) {
        const valueLengthInBytes = value.startsWith('0x') ? value.replace('0x', '').length / 2 : stringToBytes(value).length;
        return valueLengthInBytes > Number(length) ? `Value should be a maximum of ${ length } bytes` : true;
      }

      return true;
    }

    return true;
  }, [ bytesMatch, intMatch, valueType ]);

  return (
    <>
      <Box
        fontWeight={ 500 }
        lineHeight="20px"
        py={{ lg: '6px' }}
        fontSize="sm"
      >
        { name } ({ valueType })
      </Box>
      <Controller
        name={ name }
        control={ control }
        render={ renderInput }
        rules={{ required: 'Field is required', validate }}
      />
    </>
  );
};

export default React.memo(ContractMethodField);
