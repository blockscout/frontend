import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
}

const TokenInfoFieldAddress = ({ control }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'address'>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          isDisabled
        />
        <InputPlaceholder text="Token contract address"/>
      </FormControl>
    );
  }, []);

  return (
    <Controller
      name="address"
      control={ control }
      render={ renderControl }
    />
  );
};

export default React.memo(TokenInfoFieldAddress);
