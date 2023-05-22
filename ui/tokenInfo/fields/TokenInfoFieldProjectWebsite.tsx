import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import { validator } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldProjectWebsite = ({ control, isReadOnly }: Props) => {
  const renderControl: ControllerProps<Fields, 'project_website'>['render'] = React.useCallback(({ field, fieldState, formState }) => {
    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }} isRequired>
        <Input
          { ...field }
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
          required
        />
        <InputPlaceholder text="Official project website" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ isReadOnly ]);

  return (
    <Controller
      name="project_website"
      control={ control }
      render={ renderControl }
      rules={{ required: true, validate: validator }}
    />
  );
};

export default React.memo(TokenInfoFieldProjectWebsite);
