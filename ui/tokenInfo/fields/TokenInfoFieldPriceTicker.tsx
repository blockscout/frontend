import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields, TickerUrlFields } from '../types';

import { validator } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
  name: keyof TickerUrlFields;
  label: string;
}

const TokenInfoFieldPriceTicker = ({ control, isReadOnly, name, label }: Props) => {
  const renderControl: ControllerProps<Fields, typeof name>['render'] = React.useCallback(({ field, fieldState, formState }) => {
    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text={ label } error={ fieldState.error }/>
      </FormControl>
    );
  }, [ isReadOnly, label ]);

  return (
    <Controller
      name={ name }
      control={ control }
      render={ renderControl }
      rules={{ validate: validator }}
    />
  );
};

export default React.memo(TokenInfoFieldPriceTicker);
