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
import { isAddress } from 'viem';

import type { MethodFormFields } from './types';
import type { SmartContractMethodArgType } from 'types/api/contract';

import ClearButton from 'ui/shared/ClearButton';

import ContractMethodFieldZeroes from './ContractMethodFieldZeroes';
import { addZeroesAllowed } from './utils';

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

  const hasZerosControl = addZeroesAllowed(valueType);

  const renderInput = React.useCallback((
    { field, formState }: { field: ControllerRenderProps<MethodFormFields>; formState: UseFormStateReturn<MethodFormFields> },
  ) => {
    const error = formState.errors[name];

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
  }, [ name, isDisabled, placeholder, hasZerosControl, handleClear, handleAddZeroesClick ]);

  const validate = React.useCallback((value: string) => {
    switch (valueType) {
      case 'address': {
        return !isAddress(value) ? 'Invalid address format' : true;
      }

      default:
        return;
    }
  }, [ valueType ]);

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
