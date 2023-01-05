import { FormControl, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, UseFormSetValue } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { MethodInputFields } from './types';

import InputClearButton from 'ui/shared/InputClearButton';

interface Props {
  control: Control<MethodInputFields>;
  setValue: UseFormSetValue<MethodInputFields>;
  placeholder: string;
  name: string;
}

const ContractReadItemInputField = ({ control, name, placeholder, setValue }: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const handleClear = React.useCallback(() => {
    setValue(name, '');
    ref.current?.focus();
  }, [ name, setValue ]);

  const renderInput = React.useCallback(({ field }: { field: ControllerRenderProps<MethodInputFields> }) => {
    return (
      <FormControl id={ name }>
        <InputGroup size="xs">
          <Input
            { ...field }
            ref={ ref }
            placeholder={ placeholder }
          />
          <InputRightElement>
            <InputClearButton onClick={ handleClear }/>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    );
  }, [ handleClear, name, placeholder ]);

  return (
    <Controller
      name={ name }
      control={ control }
      render={ renderInput }
    />

  );
};

export default ContractReadItemInputField;
