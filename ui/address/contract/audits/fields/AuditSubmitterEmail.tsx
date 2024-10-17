import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { EMAIL_REGEXP } from 'lib/validations/email';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import type { Inputs } from '../ContractSubmitAuditForm';

interface Props {
  control: Control<Inputs>;
}

const AuditSubmitterEmail = ({ control }: Props) => {
  const renderControl: ControllerProps<Inputs, 'submitter_email'>['render'] = React.useCallback(({ field, fieldState }) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(fieldState.error) }
        />
        <InputPlaceholder text="Submitter email" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ ]);

  return (
    <Controller
      name="submitter_email"
      control={ control }
      render={ renderControl }
      rules={{ required: true, pattern: EMAIL_REGEXP }}
    />
  );
};

export default React.memo(AuditSubmitterEmail);
