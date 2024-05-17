import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldRequesterName = ({ control, isReadOnly }: Props) => {
  const renderControl: ControllerProps<Fields, 'requester_name'>['render'] = React.useCallback(({ field, fieldState, formState }) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting }
          isReadOnly={ isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text="Requester name" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ isReadOnly ]);

  return (
    <Controller
      name="requester_name"
      control={ control }
      render={ renderControl }
      rules={{ required: true }}
    />
  );
};

export default React.memo(TokenInfoFieldRequesterName);
