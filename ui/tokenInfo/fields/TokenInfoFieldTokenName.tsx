import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
}

const TokenInfoFieldTokenName = ({ control }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'token_name'>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          isReadOnly
        />
        <InputPlaceholder text="Token name"/>
      </FormControl>
    );
  }, []);

  return (
    <Controller
      name="token_name"
      control={ control }
      render={ renderControl }
    />
  );
};

export default React.memo(TokenInfoFieldTokenName);
