import { FormControl, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, UseFormSetValue } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { MethodFormFields } from './types';

import InputClearButton from 'ui/shared/InputClearButton';

interface Props {
  control: Control<MethodFormFields>;
  setValue: UseFormSetValue<MethodFormFields>;
  placeholder: string;
  name: string;
}

const ContractMethodField = ({ control, name, placeholder, setValue }: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const handleClear = React.useCallback(() => {
    setValue(name, '');
    ref.current?.focus();
  }, [ name, setValue ]);

  const renderInput = React.useCallback(({ field }: { field: ControllerRenderProps<MethodFormFields> }) => {
    return (
      <FormControl id={ name } maxW={{ base: '100%', lg: 'calc((100% - 24px) / 3)' }}>
        <InputGroup size="xs">
          <Input
            { ...field }
            ref={ ref }
            placeholder={ placeholder }
          />
          { field.value && (
            <InputRightElement>
              <InputClearButton onClick={ handleClear }/>
            </InputRightElement>
          ) }
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

export default React.memo(ContractMethodField);
