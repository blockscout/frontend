import { Button, FormControl, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { MethodInputFields } from './types';

interface Props {
  control: Control<MethodInputFields>;
  type: string;
  name: string;
  index: number;
}

const ContractReadItemInputField = ({ control, name, type, index }: Props) => {
  const fieldName = name || String(index);
  const renderInput = React.useCallback(({ field }: {field: ControllerRenderProps<MethodInputFields>}) => {
    return (
      <FormControl id={ fieldName }>
        <InputGroup key={ fieldName } size="xs">
          <Input
            { ...field }
            placeholder={ `${ name }(${ type })` }
          />
          <InputRightElement>
            <Button size="xs">clear</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    );
  }, [ fieldName, name, type ]);

  return (
    <Controller
      name={ fieldName }
      control={ control }
      render={ renderInput }
    />

  );
};

export default ContractReadItemInputField;
