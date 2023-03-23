import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, UseFormSetValue } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { MethodFormFields } from './types';
import type { SmartContractMethodArgType } from 'types/api/contract';

import InputClearButton from 'ui/shared/InputClearButton';

import ContractMethodFieldZeroes from './ContractMethodFieldZeroes';

interface Props {
  control: Control<MethodFormFields>;
  setValue: UseFormSetValue<MethodFormFields>;
  placeholder: string;
  name: string;
  valueType: SmartContractMethodArgType;
  isDisabled: boolean;
  onClear: () => void;
}

const ContractMethodField = ({ control, name, valueType, placeholder, setValue, isDisabled, onClear }: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const handleClear = React.useCallback(() => {
    setValue(name, '');
    onClear();
    ref.current?.focus();
  }, [ name, onClear, setValue ]);

  const hasZerosControl = valueType.includes('int') && !valueType.includes('[]');

  const renderInput = React.useCallback(({ field }: { field: ControllerRenderProps<MethodFormFields> }) => {
    return (
      <FormControl
        id={ name }
        flexBasis={{ base: '100%', lg: 'calc((100% - 24px) / 3 - 65px)' }}
        w={{ base: '100%', lg: 'auto' }}
        flexGrow={ 1 }
        isDisabled={ isDisabled }
      >
        <InputGroup size="xs">
          <Input
            { ...field }
            ref={ ref }
            placeholder={ placeholder }
            paddingRight={ hasZerosControl ? '120px' : '40px' }
          />
          <InputRightElement w="auto" right={ 1 }>
            { field.value && <InputClearButton onClick={ handleClear } isDisabled={ isDisabled }/> }
            { hasZerosControl && <ContractMethodFieldZeroes/> }
          </InputRightElement>
        </InputGroup>
      </FormControl>
    );
  }, [ handleClear, isDisabled, hasZerosControl, name, placeholder ]);

  return (
    <Controller
      name={ name }
      control={ control }
      render={ renderInput }
    />

  );
};

export default React.memo(ContractMethodField);
