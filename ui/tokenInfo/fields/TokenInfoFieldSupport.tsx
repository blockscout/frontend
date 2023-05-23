import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import { validator as emailValidator } from 'lib/validations/email';
import { validator as urlValidator } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldSupport = ({ control, isReadOnly }: Props) => {
  const renderControl: ControllerProps<Fields, 'support'>['render'] = React.useCallback(({ field, fieldState, formState }) => {

    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text="Support URL or email" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ isReadOnly ]);

  const validate = React.useCallback((newValue: string | undefined) => {
    const urlValidationResult = urlValidator(newValue);
    const emailValidationResult = emailValidator(newValue || '');

    if (urlValidationResult === true || emailValidationResult === true) {
      return true;
    }

    return 'Invalid format';
  }, []);

  return (
    <Controller
      name="support"
      control={ control }
      render={ renderControl }
      rules={{ validate }}
    />
  );
};

export default React.memo(TokenInfoFieldSupport);
