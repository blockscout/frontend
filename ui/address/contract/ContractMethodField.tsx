import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FieldError, UseFormGetValues, UseFormSetValue, UseFormStateReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { isAddress, isHex, getAddress } from 'viem';

import type { MethodFormFields } from './types';
import type { SmartContractMethodArgType } from 'types/api/contract';

import ClearButton from 'ui/shared/ClearButton';

import ContractMethodFieldZeroes from './ContractMethodFieldZeroes';
import { INT_REGEXP, BYTES_REGEXP, getIntBoundaries, formatBooleanValue } from './utils';

interface Props {
  name: string;
  index?: number;
  groupName?: string;
  placeholder: string;
  argType: SmartContractMethodArgType;
  control: Control<MethodFormFields>;
  setValue: UseFormSetValue<MethodFormFields>;
  getValues: UseFormGetValues<MethodFormFields>;
  isDisabled: boolean;
  isOptional?: boolean;
  onChange: () => void;
}

const ContractMethodField = ({ control, name, groupName, index, argType, placeholder, setValue, getValues, isDisabled, isOptional, onChange }: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const bgColor = useColorModeValue('white', 'black');

  const handleClear = React.useCallback(() => {
    setValue(name, '');
    onChange();
    ref.current?.focus();
  }, [ name, onChange, setValue ]);

  const handleAddZeroesClick = React.useCallback((power: number) => {
    const value = groupName && index !== undefined ? getValues()[groupName][index] : getValues()[name];
    const zeroes = Array(power).fill('0').join('');
    const newValue = value ? value + zeroes : '1' + zeroes;
    setValue(name, newValue);
    onChange();
  }, [ getValues, groupName, index, name, onChange, setValue ]);

  const intMatch = React.useMemo(() => {
    const match = argType.match(INT_REGEXP);
    if (!match) {
      return null;
    }

    const [ , isUnsigned, power = '256' ] = match;
    const [ min, max ] = getIntBoundaries(Number(power), Boolean(isUnsigned));

    return { isUnsigned, power, min, max };
  }, [ argType ]);

  const bytesMatch = React.useMemo(() => {
    return argType.match(BYTES_REGEXP);
  }, [ argType ]);

  const renderInput = React.useCallback((
    { field, formState }: { field: ControllerRenderProps<MethodFormFields>; formState: UseFormStateReturn<MethodFormFields> },
  ) => {
    const error: FieldError | undefined = index !== undefined && groupName !== undefined ?
      (formState.errors[groupName] as unknown as Array<FieldError>)?.[index] :
      formState.errors[name];

    // show control for all inputs which allows to insert 10^18 or greater numbers
    const hasZerosControl = intMatch && Number(intMatch.power) >= 64;

    return (
      <Box w="100%">
        <FormControl
          id={ name }
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
              required={ !isOptional }
              placeholder={ placeholder }
              paddingRight={ hasZerosControl ? '120px' : '40px' }
              autoComplete="off"
              bgColor={ bgColor }
            />
            <InputRightElement w="auto" right={ 1 }>
              { typeof field.value === 'string' && field.value.replace('\n', '') && <ClearButton onClick={ handleClear } isDisabled={ isDisabled }/> }
              { hasZerosControl && <ContractMethodFieldZeroes onClick={ handleAddZeroesClick } isDisabled={ isDisabled }/> }
            </InputRightElement>
          </InputGroup>
        </FormControl>
        { error && <Box color="error" fontSize="sm" mt={ 1 }>{ error.message }</Box> }
      </Box>
    );
  }, [ index, groupName, name, intMatch, isDisabled, isOptional, placeholder, bgColor, handleClear, handleAddZeroesClick ]);

  const validate = React.useCallback((_value: string | Array<string> | undefined) => {
    if (typeof _value === 'object' || !_value) {
      return;
    }

    const value = _value.replace('\n', '');

    if (!value && !isOptional) {
      return 'Field is required';
    }

    if (argType === 'address') {
      if (!isAddress(value)) {
        return 'Invalid address format';
      }

      // all lowercase addresses are valid
      const isInLowerCase = value === value.toLowerCase();
      if (isInLowerCase) {
        return true;
      }

      // check if address checksum is valid
      return getAddress(value) === value ? true : 'Invalid address checksum';
    }

    if (intMatch) {
      const formattedValue = Number(value.replace(/\s/g, ''));

      if (Object.is(formattedValue, NaN)) {
        return 'Invalid integer format';
      }

      if (formattedValue > intMatch.max || formattedValue < intMatch.min) {
        const lowerBoundary = intMatch.isUnsigned ? '0' : `-1 * 2 ^ ${ Number(intMatch.power) / 2 }`;
        const upperBoundary = intMatch.isUnsigned ? `2 ^ ${ intMatch.power } - 1` : `2 ^ ${ Number(intMatch.power) / 2 } - 1`;
        return `Value should be in range from "${ lowerBoundary }" to "${ upperBoundary }" inclusively`;
      }

      return true;
    }

    if (argType === 'bool') {
      const formattedValue = formatBooleanValue(value);
      if (formattedValue === undefined) {
        return 'Invalid boolean format. Allowed values: 0, 1, true, false';
      }
    }

    if (bytesMatch) {
      const [ , length ] = bytesMatch;

      if (!isHex(value)) {
        return 'Invalid bytes format';
      }

      if (length) {
        const valueLengthInBytes = value.replace('0x', '').length / 2;
        return valueLengthInBytes !== Number(length) ? `Value should be ${ length } bytes in length` : true;
      }

      return true;
    }

    return true;
  }, [ isOptional, argType, intMatch, bytesMatch ]);

  return (
    <Controller
      name={ name }
      control={ control }
      render={ renderInput }
      rules={{ required: isOptional ? false : 'Field is required', validate }}
    />
  );
};

export default React.memo(ContractMethodField);
